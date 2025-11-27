import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
    _id: string
    name: string
    price: number
    quantity: number
    restaurantId?: string
    description?: string
    category?: string
}

interface CartState {
    items: CartItem[]
    addItem: (item: any) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    total: number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
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
            }
        }),
        { name: 'cart-storage' }
    )
)
