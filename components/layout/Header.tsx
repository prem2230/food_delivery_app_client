'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Sparkles,
    ShoppingCart,
    User,
    Settings,
    Package,
    LogOut,
    ChevronDown,
    Home
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'

export function Header() {
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const { user, isAuthenticated, logout } = useAuthStore()
    const { items } = useCartStore()
    const router = useRouter()

    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const handleLogout = () => {
        logout()
        router.push('/')
        setShowProfileMenu(false)
    }

    // Determine home link based on authentication
    const homeLink = isAuthenticated ? '/restaurants' : '/'

    return (
        <header className="relative z-50 bg-glass border-b border-white/10 sticky top-0">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link href={homeLink} className="flex items-center gap-2">
                        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">FoodExpress</h1>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                {/* Home/Restaurants Link */}
                                <Link href="/restaurants">
                                    <Button
                                        variant="outline"
                                        className="border-white/20 text-white bg-glass hover:bg-white/15 transition-all"
                                    >
                                        <Home className="w-4 h-4" />
                                    </Button>
                                </Link>

                                {/* Cart */}
                                <Link href="/cart">
                                    <Button
                                        variant="outline"
                                        className="border-white/20 text-white bg-glass hover:bg-white/15 transition-all relative"
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Cart
                                        {items.length > 0 && (
                                            <Badge className="ml-2 gradient-primary text-white text-xs px-1.5 py-0.5 animate-glow">
                                                {items.length}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        className="border-white/20 text-white bg-glass hover:bg-white/15 transition-all"
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    >
                                        <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center mr-2">
                                            <span className="text-white text-xs font-semibold">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        Hi, {user?.name}
                                        <ChevronDown className="w-4 h-4 ml-2" />
                                    </Button>

                                    {/* Dropdown Menu */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-glass rounded-2xl border border-white/20 shadow-glass backdrop-blur-xl">
                                            <div className="p-2">
                                                <Link href="/restaurants">
                                                    <div
                                                        className="flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                                                        onClick={() => setShowProfileMenu(false)}
                                                    >
                                                        <Home className="w-4 h-4" />
                                                        Home
                                                    </div>
                                                </Link>

                                                <Link href="/profile">
                                                    <div
                                                        className="flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                                                        onClick={() => setShowProfileMenu(false)}
                                                    >
                                                        <User className="w-4 h-4" />
                                                        Profile
                                                    </div>
                                                </Link>

                                                <Link href="/orders">
                                                    <div
                                                        className="flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                                                        onClick={() => setShowProfileMenu(false)}
                                                    >
                                                        <Package className="w-4 h-4" />
                                                        My Orders
                                                    </div>
                                                </Link>

                                                <Link href="/settings">
                                                    <div
                                                        className="flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                                                        onClick={() => setShowProfileMenu(false)}
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        Settings
                                                    </div>
                                                </Link>

                                                <div className="border-t border-white/10 my-2"></div>

                                                <div
                                                    className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline" className="border-white/20 text-white bg-glass hover:bg-white/15 transition-all">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="gradient-primary hover:shadow-glow transition-all duration-300">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {showProfileMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                />
            )}
        </header>
    )
}
