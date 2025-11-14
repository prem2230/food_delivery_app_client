export interface User {
    id: string
    name: string
    email: string
    role: 'customer' | 'restaurant_owner' | 'admin'
    number: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
    role: string
    number: string
}
