import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"
import Image from "next/image"

interface RestaurantCardProps {
    name: string
    cuisine: string
    rating: number
    deliveryTime: string
    deliveryFee: string
    image: string
    isPromoted?: boolean
}

export function RestaurantCard({
    name,
    cuisine,
    rating,
    deliveryTime,
    deliveryFee,
    image,
    isPromoted = false
}: RestaurantCardProps) {
    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative">
                <Image
                    src={image}
                    alt={name}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                />
                {isPromoted && (
                    <Badge className="absolute left-2 top-2 bg-orange-500">
                        Promoted
                    </Badge>
                )}
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>{cuisine}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{rating}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{deliveryTime}</span>
                    </div>
                    <span>{deliveryFee} delivery</span>
                </div>
            </CardContent>
        </Card>
    )
}
