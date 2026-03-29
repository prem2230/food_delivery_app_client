'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, Calendar } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { Header } from '@/components/layout/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function roleLabel(role: string | undefined) {
    if (!role) return 'User'
    if (role === 'restaurant_owner') return 'Restaurant owner'
    return role.charAt(0).toUpperCase() + role.slice(1)
}

function ProfileContent() {
    const { user, checkAuth } = useAuthStore()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <Header />

            <main className="relative z-10 container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            My <span className="gradient-text">Profile</span>
                        </h1>
                        <p className="text-white/70">Your account from the user service (read-only in the UI)</p>
                    </div>

                    <Card className="bg-glass border-white/20 shadow-glass">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-3">
                                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                Profile
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <span className="text-white/90 flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4" />
                                        Full name
                                    </span>
                                    <div className="p-3 bg-white/5 rounded-xl text-white">{user?.name ?? '—'}</div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-white/90 flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </span>
                                    <div className="p-3 bg-white/5 rounded-xl text-white">{user?.email ?? '—'}</div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-white/90 flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4" />
                                        Phone
                                    </span>
                                    <div className="p-3 bg-white/5 rounded-xl text-white">{user?.number ?? '—'}</div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-white/90 flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        Role
                                    </span>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <Badge className="gradient-primary text-white">{roleLabel(user?.role)}</Badge>
                                    </div>
                                </div>
                            </div>

                            <p className="text-white/50 text-sm">
                                Editing profile fields requires a PUT endpoint on the user service; the app loads live data via{' '}
                                <code className="text-purple-300">GET /api/v1/users/profile</code>.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    )
}
