import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    _id: string
    name: string
    price: number
    quantity: number
    restaurantId: string
    restaurantOwnerId: string
    restaurantName?: string
    description?: string
    category?: string
}

interface CartState {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
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
                const { restaurantId, restaurantOwnerId } = item
                if (!restaurantId || !restaurantOwnerId) {
                    console.warn('Cart item missing restaurantId or restaurantOwnerId')
                    return
                }

                const items = get().items
                const first = items[0]

                if (first && first.restaurantId !== restaurantId) {
                    const ok =
                        typeof window !== 'undefined' &&
                        window.confirm(
                            'Your cart has items from another restaurant. Clear the cart and add this item?'
                        )
                    if (!ok) return
                    set({ items: [] })
                }

                const current = get().items
                const existing = current.find((i) => i._id === item._id)

                if (existing) {
                    set({
                        items: current.map((i) =>
                            i._id === item._id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
                        ),
                    })
                } else {
                    set({
                        items: [
                            ...current,
                            {
                                ...item,
                                quantity: item.quantity ?? 1,
                                restaurantId,
                                restaurantOwnerId,
                            },
                        ],
                    })
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((item) => item._id !== id) })
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id)
                    return
                }
                set({
                    items: get().items.map((item) =>
                        item._id === id ? { ...item, quantity } : item
                    ),
                })
            },

            clearCart: () => set({ items: [] }),

            get total() {
                return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
            },
        }),
        { name: 'cart-storage' }
    )
)
