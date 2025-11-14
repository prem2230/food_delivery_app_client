import { useState, useEffect } from 'react'
import { Order } from '@/types/order'
import { orderAPI } from '@/lib/api'

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(false)

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const response = await orderAPI.getMyOrders()
            setOrders(response.data.orders || [])
        } catch (error) {
            console.error('Failed to fetch orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const createOrder = async (orderData: any) => {
        const response = await orderAPI.create(orderData)
        return response.data.order
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return {
        orders,
        loading,
        fetchOrders,
        createOrder,
    }
}
