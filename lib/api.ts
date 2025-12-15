import axios from 'axios'
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
            number: data.number
        })
        return response.data
    },

    getProfile: async (): Promise<{ user: any }> => {
        const response = await api.get('/api/v1/users/profile')
        return response.data
    },
}

// Restaurant API
export const restaurantAPI = {
    getAll: () => api.get('/api/v1/restaurant/get-restaurants'),
    getById: (id: string) => api.get(`/api/v1/restaurant/get-restaurant/${id}`),
}

// Food API
export const foodAPI = {
    getByRestaurant: (restaurantId: string) =>
        api.get(`/api/v1/fooditem/get-foodItems-by-restaurant/${restaurantId}`),
    getAll: () => api.get('/api/v1/fooditem/get-all-foodItems'),
}

// Order API
export const orderAPI = {
    placeOrder: (orderData: any) => api.post('/api/v1/orders/place-order', orderData),
    getMyOrders: () => api.get('/api/v1/orders/get-all-ordersByUser'),
    getOrderById: (orderId: string) => api.get(`/api/v1/orders/get-order/${orderId}`),
    cancelOrder: (orderId: string) => api.put(`/api/v1/orders/cancel-order/${orderId}`),
}
