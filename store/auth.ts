import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User, LoginRequest, RegisterRequest } from '@/types/auth'
import { authApi } from '@/lib/api'

interface AuthStore extends AuthState {
    login: (data: LoginRequest) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    logout: () => void
    checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (data: LoginRequest) => {
                set({ isLoading: true })
                try {
                    const response = await authApi.login(data)
                    if (response.success) {
                        localStorage.setItem('token', response.token)
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

            register: async (data: RegisterRequest) => {
                set({ isLoading: true })
                try {
                    const response = await authApi.register(data)
                    if (response.success) {
                        // For register, we need to login after successful registration
                        await get().login({ email: data.email, password: data.password })
                    }
                } catch (error: any) {
                    set({ isLoading: false })
                    throw new Error(error.response?.data?.message || 'Registration failed')
                }
            },

            logout: () => {
                localStorage.removeItem('token')
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
            },

            checkAuth: async () => {
                const token = localStorage.getItem('token')
                if (!token) return

                try {
                    const response = await authApi.getProfile()
                    set({
                        user: response.user,
                        token,
                        isAuthenticated: true,
                    })
                } catch (error) {
                    localStorage.removeItem('token')
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
