import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

export const authAPI = {
    login: (credentials: { email: string; password: string }) =>
        apiClient.post('/api/v1/users/login', credentials),
    register: (userData: { name: string; email: string; password: string; role: string; number: string }) =>
        apiClient.post('/api/v1/users/register', userData),
    getProfile: () => apiClient.get('/api/v1/users/profile'),
}

export const restaurantAPI = {
    getAll: () => apiClient.get('/api/v1/restaurants'),
    getById: (id: string) => apiClient.get(`/api/v1/restaurants/${id}`),
}

export const orderAPI = {
    create: (orderData: any) => apiClient.post('/api/v1/orders', orderData),
    getMyOrders: () => apiClient.get('/api/v1/orders/my-orders'),
}

export const foodAPI = {
    getByRestaurant: (restaurantId: string) => apiClient.get(`/api/v1/fooditem/restaurant/${restaurantId}`),
}
