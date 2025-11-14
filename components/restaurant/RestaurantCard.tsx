import { Restaurant } from '@/types/restaurant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Star, Truck } from 'lucide-react'
import Link from 'next/link'

interface RestaurantCardProps {
    restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200">
                {restaurant.image && (
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        <span>${restaurant.deliveryFee}</span>
                    </div>
                </div>
                <Link href={`/restaurant/${restaurant._id}`}>
                    <Button className="w-full">View Menu</Button>
                </Link>
            </CardContent>
        </Card>
    )
}
