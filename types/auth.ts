export type UserRole = 'customer' | 'restaurant_owner' | 'admin'

export interface User {
    id: string
    email: string
    name: string
    role: UserRole
    number: number
}

export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
    role: 'customer' | 'restaurant_owner'
    number: string
}

export interface LoginResponse {
    success: boolean
    message: string
    token: string
    user: User
}

export interface RegisterResponse {
    success: boolean
    message: string
    user: User
}
