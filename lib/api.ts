import axios from 'axios'
import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/types/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post('/users/login', data)
        return response.data
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post('/users/register', {
            ...data,
            number: parseInt(data.number, 10)
        })
        return response.data
    },

    getProfile: async (): Promise<{ user: any }> => {
        const response = await api.get('/users/profile')
        return response.data
    },
}
