'use client'

import { useState, useEffect } from 'react'
import { Restaurant } from '@/types/restaurant'
import { RestaurantCard } from './RestaurantCard'
import { restaurantAPI } from '@/lib/api'

export function RestaurantList() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await restaurantAPI.getAll()
                setRestaurants(response.data.restaurants || [])
            } catch (error) {
                console.error('Failed to fetch restaurants:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [])

    if (loading) {
        return <div className="text-center p-8">Loading restaurants...</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
        </div>
    )
}
