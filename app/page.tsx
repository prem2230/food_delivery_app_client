import { RestaurantList } from '@/components/restaurant/RestaurantList'
import { Cart } from '@/components/order/Cart'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
          <RestaurantList />
        </div>
        <div className="lg:col-span-1">
          <Cart />
        </div>
      </div>
    </div>
  )
}
