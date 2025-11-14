import { authAPI } from './api'
import { useAuthStore } from './store'
import { LoginCredentials, RegisterData } from '@/types/auth'

export const login = async (credentials: LoginCredentials) => {
    const response = await authAPI.login(credentials)
    const { user, token } = response.data
    useAuthStore.getState().login(user, token)
    return { user, token }
}

export const register = async (userData: RegisterData) => {
    const response = await authAPI.register(userData)
    const { user, token } = response.data
    useAuthStore.getState().login(user, token)
    return { user, token }
}

export const logout = () => {
    useAuthStore.getState().logout()
}
