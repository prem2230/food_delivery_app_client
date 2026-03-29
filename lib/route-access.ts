import type { UserRole } from '@/types/auth'

/** Stable arrays for `ProtectedRoute` allowedRoles (avoids new [] each render). */
export const CUSTOMER_ONLY: UserRole[] = ['customer']
export const RESTAURANT_OWNER_ONLY: UserRole[] = ['restaurant_owner']
