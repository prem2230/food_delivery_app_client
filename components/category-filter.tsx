"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

const categories = [
    "All",
    "Pizza",
    "Burgers",
    "Sushi",
    "Indian",
    "Chinese",
    "Mexican",
    "Italian",
    "Healthy"
]

export function CategoryFilter() {
    const [selected, setSelected] = useState("All")

    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
                <Button
                    key={category}
                    variant={category === selected ? "default" : "outline"}
                    className="whitespace-nowrap"
                    onClick={() => setSelected(category)}
                >
                    {category}
                </Button>
            ))}
        </div>
    )
}
