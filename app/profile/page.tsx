'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, Calendar, Edit, Save, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { Header } from '@/components/layout/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function ProfileContent() {
    const { user } = useAuthStore()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        number: user?.number || ''
    })

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                number: user.number || ''
            })
        }
    }, [user])

    const handleSave = () => {
        // TODO: Implement profile update API call
        setIsEditing(false)
    }

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            number: user?.number || ''
        })
        setIsEditing(false)
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements */}
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
                        <p className="text-white/70">Manage your account information</p>
                    </div>

                    <Card className="bg-glass border-white/20 shadow-glass">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-white flex items-center gap-3">
                                    <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    Profile Information
                                </CardTitle>

                                {!isEditing ? (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        variant="outline"
                                        className="border-white/20 text-white bg-glass hover:bg-white/15"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleSave}
                                            className="gradient-primary hover:shadow-glow"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                            className="border-white/20 text-white bg-glass hover:bg-white/15"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-white/90 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Full Name
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                                        />
                                    ) : (
                                        <div className="p-3 bg-white/5 rounded-xl text-white">
                                            {user?.name}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white/90 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                                        />
                                    ) : (
                                        <div className="p-3 bg-white/5 rounded-xl text-white">
                                            {user?.email}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white/90 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.number}
                                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                                        />
                                    ) : (
                                        <div className="p-3 bg-white/5 rounded-xl text-white">
                                            {user?.number}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-white/90 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Account Type
                                    </Label>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <Badge className="gradient-primary text-white">
                                            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
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
