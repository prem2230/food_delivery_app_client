'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RESTAURANT_OWNER_ONLY } from '@/lib/route-access'
import { restaurantAPI } from '@/lib/api'
import { Restaurant } from '@/types/restaurant'
import { UtensilsCrossed, ClipboardList, Trash2, Plus } from 'lucide-react'

const CUISINES = [
    'Indian',
    'Chinese',
    'Italian',
    'Mexican',
    'Thai',
    'Japanese',
    'Korean',
    'Fast Food',
    'Bakery',
    'Healthy Food',
    'Desserts',
    'Seafood',
    'Barbecue',
    'Middle Eastern',
    'American',
    'French',
] as const

function OwnerDashboardContent() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({
        name: '',
        address: '',
        contactNumber: '',
        cuisine: 'Indian' as (typeof CUISINES)[number],
        deliveryFee: '0',
        deliveryTime: '30',
    })

    const load = useCallback(async () => {
        try {
            setLoading(true)
            setError('')
            const res = await restaurantAPI.getByOwner()
            setRestaurants(res.data.restaurants || [])
        } catch (e: any) {
            setError(e.response?.data?.message || 'Failed to load your restaurants')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await restaurantAPI.register({
                name: form.name.trim(),
                address: form.address.trim(),
                contactNumber: form.contactNumber.trim(),
                cuisine: form.cuisine,
                deliveryFee: Number(form.deliveryFee) || 0,
                deliveryTime: Number(form.deliveryTime) || 0,
            })
            setForm({
                name: '',
                address: '',
                contactNumber: '',
                cuisine: 'Indian',
                deliveryFee: '0',
                deliveryTime: '30',
            })
            await load()
        } catch (err: any) {
            alert(err.response?.data?.message || 'Could not register restaurant')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this restaurant? This cannot be undone.')) return
        try {
            await restaurantAPI.delete(id)
            await load()
        } catch (err: any) {
            alert(err.response?.data?.message || 'Delete failed')
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <Header />

            <main className="relative z-10 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Restaurant <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-white/70">Register a venue, manage menus, and fulfill orders</p>
                </div>

                {loading && (
                    <div className="flex justify-center py-16">
                        <div className="bg-glass rounded-2xl p-8 shadow-glass">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent mx-auto mb-4" />
                            <p className="text-white/70">Loading...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-glass border border-red-400/30 rounded-2xl p-6 mb-8">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button onClick={load} className="gradient-primary">
                            Retry
                        </Button>
                    </div>
                )}

                {!loading && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <Card className="bg-glass border-white/20 shadow-glass h-fit">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Register a restaurant
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <Label className="text-white/90">Name</Label>
                                        <Input
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                            className="mt-1 bg-white/10 border-white/20 text-white"
                                            placeholder="Restaurant name"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/90">Address</Label>
                                        <Input
                                            required
                                            value={form.address}
                                            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                                            className="mt-1 bg-white/10 border-white/20 text-white"
                                            placeholder="Full address"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/90">Contact (10 digits)</Label>
                                        <Input
                                            required
                                            maxLength={10}
                                            value={form.contactNumber}
                                            onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                                            className="mt-1 bg-white/10 border-white/20 text-white"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/90">Cuisine</Label>
                                        <select
                                            value={form.cuisine}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, cuisine: e.target.value as (typeof CUISINES)[number] }))
                                            }
                                            className="mt-1 w-full h-9 rounded-md border border-white/20 bg-white/10 px-3 text-white"
                                        >
                                            {CUISINES.map((c) => (
                                                <option key={c} value={c} className="bg-slate-900">
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-white/90">Delivery fee</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={form.deliveryFee}
                                                onChange={(e) => setForm((f) => ({ ...f, deliveryFee: e.target.value }))}
                                                className="mt-1 bg-white/10 border-white/20 text-white"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-white/90">Delivery time (min)</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={form.deliveryTime}
                                                onChange={(e) => setForm((f) => ({ ...f, deliveryTime: e.target.value }))}
                                                className="mt-1 bg-white/10 border-white/20 text-white"
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={submitting} className="w-full gradient-primary">
                                        {submitting ? 'Saving...' : 'Register restaurant'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white">Your restaurants</h2>
                            {restaurants.length === 0 ? (
                                <div className="bg-glass rounded-2xl p-10 text-center border border-white/10">
                                    <p className="text-white/70">No restaurants yet. Add one using the form.</p>
                                </div>
                            ) : (
                                restaurants.map((r) => (
                                    <Card key={r._id} className="bg-glass border-white/20 shadow-glass">
                                        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{r.name}</h3>
                                                <p className="text-white/60 text-sm">{r.address}</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <Badge className="gradient-primary text-white">{r.cuisine}</Badge>
                                                    {!r.isActive && (
                                                        <Badge variant="destructive" className="bg-red-500/80">
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Button asChild variant="outline" className="border-white/20 text-white bg-white/5">
                                                    <Link href={`/owner/restaurant/${r._id}/menu`}>
                                                        <UtensilsCrossed className="w-4 h-4 mr-2" />
                                                        Menu
                                                    </Link>
                                                </Button>
                                                <Button asChild variant="outline" className="border-white/20 text-white bg-white/5">
                                                    <Link href={`/owner/restaurant/${r._id}/orders`}>
                                                        <ClipboardList className="w-4 h-4 mr-2" />
                                                        Orders
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="border-red-400/30 text-red-400"
                                                    onClick={() => handleDelete(r._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default function OwnerDashboardPage() {
    return (
        <ProtectedRoute allowedRoles={RESTAURANT_OWNER_ONLY}>
            <OwnerDashboardContent />
        </ProtectedRoute>
    )
}
