'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

interface ProtectedRouteProps {
    children: React.ReactNode
    redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, checkAuth, initialize } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        initialize()
        checkAuth()
    }, [initialize, checkAuth])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(redirectTo)
        }
    }, [isAuthenticated, isLoading, router, redirectTo])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="bg-glass rounded-2xl p-8 shadow-glass">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white/70">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}
