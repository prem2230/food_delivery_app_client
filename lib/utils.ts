import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserRole } from '@/types/auth'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Default landing route after login for customers vs restaurant owners (API restricts browse to customers). */
export function homePathForRole(role: UserRole | undefined) {
    if (role === 'restaurant_owner') return '/owner'
    return '/restaurants'
}
