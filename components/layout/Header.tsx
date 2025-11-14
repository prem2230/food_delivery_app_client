'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export function Header() {
    const { user, isAuthenticated, logout } = useAuth()
    const { items } = useCart()

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    FoodDelivery
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/cart" className="relative">
                        <Button variant="outline" size="icon">
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                        {items.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                {items.length}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <span>Hi, {user?.name}</span>
                            <Button variant="outline" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Register</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
