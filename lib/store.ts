import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/auth'
import { CartItem, MenuItem } from '@/types/restaurant'

interface AuthState {
    user: User | null
    token: string | null
    login: (user: User, token: string) => void
    logout: () => void
}

interface CartState {
    items: CartItem[]
    addItem: (item: MenuItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    total: number
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            login: (user, token) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', token)
                }
                set({ user, token })
            },
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token')
                }
                set({ user: null, token: null })
            },
        }),
        { name: 'auth-storage' }
    )
)

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (item) => {
        const items = get().items
        const existing = items.find(i => i._id === item._id)
        if (existing) {
            set({
                items: items.map(i =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                )
            })
        } else {
            set({ items: [...items, { ...item, quantity: 1 }] })
        }
    },
    removeItem: (id) => {
        set({ items: get().items.filter(item => item._id !== id) })
    },
    updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
            get().removeItem(id)
            return
        }
        set({
            items: get().items.map(item =>
                item._id === id ? { ...item, quantity } : item
            )
        })
    },
    clearCart: () => set({ items: [] }),
    get total() {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
}))
