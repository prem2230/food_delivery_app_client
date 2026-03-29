'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Bell, User, Shield } from 'lucide-react'

function SettingsContent() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            <Header />

            <main className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-4xl font-bold text-white mb-2">
                    <span className="gradient-text">Settings</span>
                </h1>
                <p className="text-white/70 mb-8">Account preferences use the same glass theme as the rest of the app</p>

                <div className="space-y-4">
                    <Card className="bg-glass border-white/20">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <User className="w-5 h-5" />
                                Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-white/80 text-sm">
                            Update your name and phone on the{' '}
                            <Link href="/profile" className="text-purple-300 hover:underline">
                                profile
                            </Link>{' '}
                            page. Profile changes are read-only until a user-service update endpoint is added.
                        </CardContent>
                    </Card>

                    <Card className="bg-glass border-white/20">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <Bell className="w-5 h-5" />
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-white/60 text-sm">
                            Push and email notifications can be wired when your notification microservice is ready.
                        </CardContent>
                    </Card>

                    <Card className="bg-glass border-white/20">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <Shield className="w-5 h-5" />
                                Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-white/60 text-sm">
                            Sessions use JWT from the user service. Log out from the header to clear your token on this device.
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsContent />
        </ProtectedRoute>
    )
}
