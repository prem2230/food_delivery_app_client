'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import type { UserRole } from '@/types/auth'
import { homePathForRole } from '@/lib/utils'

interface ProtectedRouteProps {
    children: React.ReactNode
    redirectTo?: string
    /** If set, only these roles may access the route; others are redirected to their home. */
    allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, redirectTo = '/login', allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user, checkAuth, initialize } = useAuthStore()
    const router = useRouter()
    const allowedRolesKey = allowedRoles?.join(',') ?? ''

    useEffect(() => {
        initialize()
        checkAuth()
    }, [initialize, checkAuth])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(redirectTo)
        }
    }, [isAuthenticated, isLoading, router, redirectTo])

    useEffect(() => {
        if (!allowedRolesKey) return
        if (!isAuthenticated || !user) return
        const roles = allowedRolesKey.split(',') as UserRole[]
        if (!roles.includes(user.role)) {
            router.replace(homePathForRole(user.role))
        }
    }, [isAuthenticated, user, allowedRolesKey, router])

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

    if (allowedRoles?.length && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="bg-glass rounded-2xl p-8 shadow-glass">
                    <p className="text-white/70">Redirecting...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
