import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User, LoginRequest } from '@/types/auth'
import { authApi } from '@/lib/api'
import type { RegisterFormData } from '@/lib/validators'

interface AuthStore extends AuthState {
    login: (data: LoginRequest) => Promise<void>
    register: (data: RegisterFormData) => Promise<void>
    logout: () => void
    checkAuth: () => Promise<void>
    initialize: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            initialize: () => {
                if (typeof window !== 'undefined') {
                    const token = localStorage.getItem('token')
                    if (token) {
                        set({ token, isAuthenticated: true })
                        get().checkAuth()
                    }
                }
            },

            login: async (data: LoginRequest) => {
                set({ isLoading: true })
                try {
                    const response = await authApi.login(data)
                    if (response.success) {
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('token', response.token)
                        }
                        set({
                            user: response.user,
                            token: response.token,
                            isAuthenticated: true,
                            isLoading: false,
                        })
                    }
                } catch (error: any) {
                    set({ isLoading: false })
                    throw new Error(error.response?.data?.message || 'Login failed')
                }
            },

            register: async (data: RegisterFormData) => {
                set({ isLoading: true })
                try {
                    const response = await authApi.register({
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        number: data.number,
                        role: data.role === 'owner' ? 'restaurant_owner' : 'customer',
                    })
                    if (response.success) {
                        await get().login({ email: data.email, password: data.password })
                    }
                } catch (error: any) {
                    set({ isLoading: false })
                    throw new Error(error.response?.data?.message || 'Registration failed')
                }
            },

            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token')
                }
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
            },

            checkAuth: async () => {
                const token = localStorage.getItem('token')
                if (!token) {
                    set({ isAuthenticated: false, user: null, token: null })
                    return
                }

                try {
                    const response = await authApi.getProfile()
                    set({
                        user: response.user,
                        token,
                        isAuthenticated: true,
                    })
                } catch (error) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token')
                    }
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                    })
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
)
