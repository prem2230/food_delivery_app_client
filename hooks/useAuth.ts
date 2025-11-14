import { useAuthStore } from '@/lib/store'
import { login as authLogin, register as authRegister, logout as authLogout } from '@/lib/auth'
import { LoginCredentials, RegisterData } from '@/types/auth'

export const useAuth = () => {
    const { user, token } = useAuthStore()

    const login = async (credentials: LoginCredentials) => {
        return await authLogin(credentials)
    }

    const register = async (userData: RegisterData) => {
        return await authRegister(userData)
    }

    const logout = () => {
        authLogout()
    }

    return {
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
    }
}