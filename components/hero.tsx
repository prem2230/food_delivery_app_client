import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search } from "lucide-react"

export function Hero() {
    return (
        <section className="relative bg-gradient-to-r from-orange-400 to-red-500 py-20 text-white">
            <div className="container mx-auto px-4 text-center">
                <h1 className="mb-4 text-5xl font-bold">
                    Delicious food delivered to your door
                </h1>
                <p className="mb-8 text-xl opacity-90">
                    Order from your favorite restaurants and get fresh food delivered fast
                </p>

                <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Enter your delivery address"
                            className="pl-10 text-black"
                        />
                    </div>
                    <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
                        <Search className="mr-2 h-4 w-4" />
                        Find Food
                    </Button>
                </div>
            </div>
        </section>
    )
}
