'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Home, ShoppingBag, User, History } from 'lucide-react'

export function Sidebar() {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) return null

    return (
        <aside className="w-64 bg-gray-50 border-r min-h-screen p-4">
            <nav className="space-y-2">
                <Link href="/" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                    <Home className="w-4 h-4" />
                    Home
                </Link>
                <Link href="/orders" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                    <ShoppingBag className="w-4 h-4" />
                    My Orders
                </Link>
                <Link href="/profile" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                    <User className="w-4 h-4" />
                    Profile
                </Link>
            </nav>
        </aside>
    )
}
