'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RESTAURANT_OWNER_ONLY } from '@/lib/route-access'
import { foodAPI } from '@/lib/api'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'

const CATEGORIES = ['Starter', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Salad', 'Breakfast'] as const

interface FoodRow {
    _id: string
    name: string
    description?: string
    price: number
    category: string
    isVeg: boolean
    isAvailable: boolean
    quantity?: number
}

function MenuManageContent() {
    const params = useParams()
    const router = useRouter()
    const id = typeof params?.id === 'string' ? params.id : ''
    const [items, setItems] = useState<FoodRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editing, setEditing] = useState<FoodRow | null>(null)
    const [creating, setCreating] = useState(false)
    const [form, setForm] = useState({
        name: '',
        price: '',
        category: 'Main Course' as (typeof CATEGORIES)[number],
        isVeg: true,
        description: '',
        isAvailable: true,
        stock: '0',
    })

    const load = useCallback(async () => {
        if (!id) return
        try {
            setLoading(true)
            setError('')
            const res = await foodAPI.getByRestaurant(id)
            setItems(res.data.foodItems || [])
        } catch (e: any) {
            setError(e.response?.data?.message || 'Failed to load menu')
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        load()
    }, [load])

    const resetForm = () => {
        setForm({
            name: '',
            price: '',
            category: 'Main Course',
            isVeg: true,
            description: '',
            isAvailable: true,
            stock: '0',
        })
        setEditing(null)
        setCreating(false)
    }

    const openEdit = (item: FoodRow) => {
        setEditing(item)
        setCreating(false)
        setForm({
            name: item.name,
            price: String(item.price),
            category: (CATEGORIES.includes(item.category as any) ? item.category : 'Main Course') as (typeof CATEGORIES)[number],
            isVeg: item.isVeg,
            description: item.description || '',
            isAvailable: item.isAvailable,
            stock: String(item.quantity ?? 0),
        })
    }

    const submitCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return
        try {
            await foodAPI.add(id, {
                name: form.name.trim(),
                price: Number(form.price),
                isVeg: form.isVeg,
                category: form.category,
                description: form.description.trim(),
                isAvailable: form.isAvailable,
                quantity: Number(form.stock) || 0,
            })
            resetForm()
            await load()
        } catch (err: any) {
            alert(err.response?.data?.message || 'Could not add item')
        }
    }

    const submitEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editing) return
        try {
            await foodAPI.update(editing._id, {
                name: form.name.trim(),
                price: Number(form.price),
                isVeg: form.isVeg,
                category: form.category,
                description: form.description.trim(),
            })
            await foodAPI.updateQuantity(editing._id, Number(form.stock) || 0)
            resetForm()
            await load()
        } catch (err: any) {
            alert(err.response?.data?.message || 'Could not update item')
        }
    }

    const handleDelete = async (itemId: string) => {
        if (!confirm('Remove this item from the menu?')) return
        try {
            await foodAPI.delete(itemId)
            await load()
        } catch (err: any) {
            alert(err.response?.data?.message || 'Delete failed')
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            <Header />

            <main className="relative z-10 container mx-auto px-4 py-8">
                <Button
                    variant="outline"
                    onClick={() => router.push('/owner')}
                    className="border-white/20 text-white bg-glass mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Menu <span className="gradient-text">management</span>
                    </h1>
                    <Button
                        className="gradient-primary"
                        onClick={() => {
                            resetForm()
                            setCreating(true)
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add item
                    </Button>
                </div>

                {(creating || editing) && (
                    <Card className="bg-glass border-white/20 mb-8">
                        <CardHeader>
                            <CardTitle className="text-white">{editing ? 'Edit item' : 'New item'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={editing ? submitEdit : submitCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label className="text-white/90">Name</Label>
                                    <Input
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                        className="mt-1 bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-white/90">Price</Label>
                                    <Input
                                        required
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                                        className="mt-1 bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-white/90">Category</Label>
                                    <select
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, category: e.target.value as (typeof CATEGORIES)[number] }))
                                        }
                                        className="mt-1 w-full h-9 rounded-md border border-white/20 bg-white/10 px-3 text-white"
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c} className="bg-slate-900">
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-white/90">Stock quantity</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={form.stock}
                                        onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                                        className="mt-1 bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                                <div className="flex items-center gap-4 pt-6">
                                    <label className="flex items-center gap-2 text-white cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.isVeg}
                                            onChange={(e) => setForm((f) => ({ ...f, isVeg: e.target.checked }))}
                                        />
                                        Vegetarian
                                    </label>
                                    <label className="flex items-center gap-2 text-white cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.isAvailable}
                                            onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
                                        />
                                        Available
                                    </label>
                                </div>
                                <div className="md:col-span-2">
                                    <Label className="text-white/90">Description</Label>
                                    <Input
                                        value={form.description}
                                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                        className="mt-1 bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                                <div className="md:col-span-2 flex gap-2">
                                    <Button type="submit" className="gradient-primary">
                                        {editing ? 'Save changes' : 'Create item'}
                                    </Button>
                                    <Button type="button" variant="outline" className="border-white/20 text-white" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {loading && (
                    <div className="text-center text-white/70 py-16">Loading menu...</div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 text-red-300 mb-6">{error}</div>
                )}

                {!loading && (
                    <div className="grid gap-4">
                        {items.map((item) => (
                            <Card key={item._id} className="bg-glass border-white/20">
                                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                        <p className="text-white/60 text-sm">{item.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge className="gradient-primary text-white">{item.category}</Badge>
                                            <Badge className="bg-white/10 text-white">{item.isVeg ? 'Veg' : 'Non-veg'}</Badge>
                                            {!item.isAvailable && (
                                                <Badge className="bg-red-500/60 text-white">Unavailable</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold gradient-text">${item.price}</p>
                                        <p className="text-white/50 text-sm">Stock: {item.quantity ?? 0}</p>
                                        <div className="flex gap-2 mt-3 justify-end">
                                            <Button
                                                size="default"
                                                variant="outline"
                                                className="border-white/20 text-white"
                                                onClick={() => openEdit(item)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="default"
                                                variant="outline"
                                                className="border-red-400/40 text-red-400"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && items.length === 0 && !creating && (
                    <p className="text-center text-white/60 py-12">No dishes yet. Add your first menu item.</p>
                )}

                <p className="text-center mt-8">
                    <Link href={`/owner/restaurant/${id}/orders`} className="text-purple-300 hover:underline">
                        View orders for this restaurant
                    </Link>
                </p>
            </main>
        </div>
    )
}

export default function OwnerMenuPage() {
    return (
        <ProtectedRoute allowedRoles={RESTAURANT_OWNER_ONLY}>
            <MenuManageContent />
        </ProtectedRoute>
    )
}
