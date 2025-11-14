import { MenuItems } from '@/components/restaurant/MenuItems'
import { Cart } from '@/components/order/Cart'

export default function RestaurantPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <h1 className="text-3xl font-bold mb-6">Menu</h1>
                    <MenuItems restaurantId={params.id} />
                </div>
                <div className="lg:col-span-1">
                    <Cart />
                </div>
            </div>
        </div>
    )
}
