export interface PaymentMethod {
    id: string
    type: 'card' | 'paypal' | 'cash'
    last4?: string
    brand?: string
}

export interface PaymentData {
    amount: number
    method: PaymentMethod
    orderId: string
}
