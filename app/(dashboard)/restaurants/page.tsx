'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, Truck, MapPin } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { restaurantAPI } from '@/lib/api'
import { Header } from '@/components/layout/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Restaurant } from '@/types/restaurant'

function RestaurantsContent() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchRestaurants()
    }, [])

    const fetchRestaurants = async () => {
        try {
            setLoading(true)
            const response = await restaurantAPI.getAll()
            setRestaurants(response.data.restaurants || [])
        } catch (error: any) {
            console.error('Error fetching restaurants:', error)
            setError(error.response?.data?.message || 'Failed to load restaurants')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <Header />

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Discover <span className="gradient-text">Restaurants</span>
                    </h2>
                    <p className="text-white/70 text-lg">Order from your favorite local restaurants</p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="bg-glass rounded-2xl p-8 shadow-glass">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent mx-auto mb-4"></div>
                            <span className="text-white/70">Loading restaurants...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-glass border border-red-400/20 rounded-2xl p-6 mb-8 shadow-glass">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button
                            onClick={fetchRestaurants}
                            className="gradient-primary hover:shadow-glow transition-all"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {!loading && !error && restaurants.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-glass rounded-3xl p-12 shadow-glass max-w-md mx-auto">
                            <div className="text-6xl mb-6">🍽️</div>
                            <h3 className="text-2xl font-bold text-white mb-4">No restaurants available</h3>
                            <p className="text-white/70">Check back later for new restaurants!</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant) => (
                        <div key={restaurant._id} className="bg-glass rounded-2xl overflow-hidden shadow-glass hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02] group">
                            <div className="aspect-video bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden">
                                {restaurant.image ? (
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">🍽️</div>
                                        <span className="text-white/50 text-sm">Restaurant Image</span>
                                    </div>
                                )}
                                {!restaurant.isActive && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Badge variant="destructive" className="bg-red-500/80 text-white">Closed</Badge>
                                    </div>
                                )}
                                {restaurant.rating && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-glass px-2 py-1 rounded-full">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-white text-sm font-medium">{restaurant.rating}</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-white mb-2">{restaurant.name}</h3>
                                    <p className="text-white/70 text-sm mb-3">{restaurant.description}</p>

                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge className="gradient-primary text-white text-xs">
                                            {restaurant.cuisine || 'Mixed Cuisine'}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                                        {restaurant.deliveryTime && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{restaurant.deliveryTime}</span>
                                            </div>
                                        )}

                                        {restaurant.deliveryFee !== undefined && (
                                            <div className="flex items-center gap-1">
                                                <Truck className="w-4 h-4" />
                                                <span>{restaurant.deliveryFee === 0 ? 'Free' : `$${restaurant.deliveryFee}`}</span>
                                            </div>
                                        )}
                                    </div>

                                    {restaurant.address && (
                                        <div className="flex items-center gap-1 text-sm text-white/50 mb-4">
                                            <MapPin className="w-4 h-4" />
                                            <span className="truncate">{restaurant.address}</span>
                                        </div>
                                    )}
                                </div>

                                <Link href={`/restaurant/${restaurant._id}`}>
                                    <Button
                                        className={`w-full ${restaurant.isActive
                                            ? 'gradient-primary hover:shadow-glow transition-all duration-300'
                                            : 'bg-gray-600 cursor-not-allowed'
                                            }`}
                                        disabled={!restaurant.isActive}
                                    >
                                        {restaurant.isActive ? 'View Menu' : 'Currently Closed'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default function RestaurantsPage() {
    return (
        <ProtectedRoute>
            <RestaurantsContent />
        </ProtectedRoute>
    )
}
