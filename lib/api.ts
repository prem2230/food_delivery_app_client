import axios, { AxiosResponse } from 'axios'
import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/types/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

// Auth Api
export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post('/api/v1/users/login', data)
        return response.data
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post('/api/v1/users/register', {
            ...data,
            number: typeof data.number === 'string' ? Number(data.number) : data.number,
        })
        return response.data
    },

    getProfile: async (): Promise<{ user: any }> => {
        const response = await api.get('/api/v1/users/profile')
        return response.data
    },

    getUserById: (id: string) => api.get(`/api/v1/users/getUser/${id}`),
}

// Restaurant API
export const restaurantAPI = {
    getAll: () => api.get('/api/v1/restaurant/get-restaurants'),
    getById: (id: string) => api.get(`/api/v1/restaurant/get-restaurant/${id}`),
    register: (body: {
        name: string
        address: string
        contactNumber: string
        cuisine: string
        image?: string
        rating?: number
        deliveryFee?: number
        deliveryTime?: number
    }) => api.post('/api/v1/restaurant/register', body),
    getByOwner: () => api.get('/api/v1/restaurant/get-restaurants-by-owner'),
    update: (id: string, body: Record<string, unknown>) =>
        api.put(`/api/v1/restaurant/update-restaurant/${id}`, body),
    delete: (id: string) => api.delete(`/api/v1/restaurant/delete-restaurant/${id}`),
}

// Food API
export const foodAPI = {
    getByRestaurant: async (restaurantId: string): Promise<AxiosResponse<{ foodItems?: any[] }>> => {
        try {
            return await api.get(`/api/v1/fooditem/get-foodItems-by-restaurant/${restaurantId}`)
        } catch (e: any) {
            if (e.response?.status === 404) {
                return { data: { foodItems: [] } } as unknown as AxiosResponse<{ foodItems: any[] }>
            }
            throw e
        }
    },
    getAll: () => api.get('/api/v1/fooditem/get-all-foodItems'),
    getById: (id: string) => api.get(`/api/v1/fooditem/get-fooditem/${id}`),
    add: (restaurantId: string, body: Record<string, unknown>) =>
        api.post(`/api/v1/fooditem/add-foodItem/${restaurantId}`, body),
    update: (id: string, body: Record<string, unknown>) =>
        api.put(`/api/v1/fooditem/update-foodItem/${id}`, body),
    updateQuantity: (id: string, quantity: number) =>
        api.put(`/api/v1/fooditem/update-foodItem-quantity/${id}`, { quantity }),
    delete: (id: string) => api.delete(`/api/v1/fooditem/delete-foodItem/${id}`),
}

export type PlaceOrderPayload = {
    restaurantId: string
    restaurantOwnerId: string
    items: { foodItemId: string; quantity: number; price: number | string }[]
    totalAmount: number
    deliveryAddress: string
}

// Order API
export const orderAPI = {
    placeOrder: (orderData: PlaceOrderPayload) => api.post('/api/v1/orders/place-order', orderData),
    getMyOrders: async () => {
        try {
            return await api.get('/api/v1/orders/get-all-ordersByUser')
        } catch (e: any) {
            if (e.response?.status === 404) {
                return { data: { orders: [] } } as unknown as AxiosResponse<{ orders: any[] }>
            }
            throw e
        }
    },
    getOrderById: (orderId: string) => api.get(`/api/v1/orders/get-order/${orderId}`),
    cancelOrder: (orderId: string) => api.put(`/api/v1/orders/cancel-order/${orderId}`),
    updateOrder: (orderId: string, body: { items?: any[]; deliveryAddress?: string; totalAmount?: number }) =>
        api.put(`/api/v1/orders/update-order/${orderId}`, body),
    getByRestaurant: async (restaurantId: string) => {
        try {
            return await api.get(`/api/v1/orders/get-all-ordersByRestaurant/${restaurantId}`)
        } catch (e: any) {
            if (e.response?.status === 404) {
                return { data: { orders: [] } } as unknown as AxiosResponse<{ orders: any[] }>
            }
            throw e
        }
    },
    updateStatus: (orderId: string, status: string) =>
        api.put(`/api/v1/orders/update-order-status/${orderId}`, { status }),
}
