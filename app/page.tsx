// app/page.tsx
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CategoryFilter } from "@/components/category-filter"
import { RestaurantCard } from "@/components/restaurant-card"

const restaurants = [
  {
    name: "Mario's Pizza Palace",
    cuisine: "Italian • Pizza",
    rating: 4.5,
    deliveryTime: "25-40 min",
    deliveryFee: "Free",
    image: "/api/placeholder/300/200",
    isPromoted: true
  },
  {
    name: "Burger Junction",
    cuisine: "American • Burgers",
    rating: 4.3,
    deliveryTime: "20-35 min",
    deliveryFee: "$2.99",
    image: "/api/placeholder/300/200"
  },
  {
    name: "Sushi Zen",
    cuisine: "Japanese • Sushi",
    rating: 4.7,
    deliveryTime: "30-45 min",
    deliveryFee: "Free",
    image: "/api/placeholder/300/200"
  },
  {
    name: "Spice Garden",
    cuisine: "Indian • Curry",
    rating: 4.4,
    deliveryTime: "35-50 min",
    deliveryFee: "$1.99",
    image: "/api/placeholder/300/200"
  },
  {
    name: "Taco Fiesta",
    cuisine: "Mexican • Tacos",
    rating: 4.2,
    deliveryTime: "15-30 min",
    deliveryFee: "Free",
    image: "/api/placeholder/300/200"
  },
  {
    name: "Green Bowl",
    cuisine: "Healthy • Salads",
    rating: 4.6,
    deliveryTime: "20-35 min",
    deliveryFee: "$2.49",
    image: "/api/placeholder/300/200"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Browse by Category</h2>
          <CategoryFilter />
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold">Popular Restaurants</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant, index) => (
              <RestaurantCard key={index} {...restaurant} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
