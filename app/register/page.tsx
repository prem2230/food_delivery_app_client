'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Crown, ShoppingBag, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/auth'
import { registerSchema, type RegisterFormData } from '@/lib/validators'

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const { register: registerUser, isLoading } = useAuthStore()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'customer',
        },
    })

    const selectedRole = watch('role')

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser(data)
            router.push('/')
        } catch (error: any) {
            setError('root', {
                message: error.response?.data?.message || 'Registration failed',
            })
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-emerald-900 via-teal-900 to-cyan-900">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Glassmorphism card */}
                    <div className="bg-glass rounded-3xl p-8 shadow-glass">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl mb-4">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Join Us</h1>
                            <p className="text-white/70">Create your account to get started</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-white/90 text-sm font-medium">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                    <Input
                                        placeholder="Enter your full name"
                                        className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl h-12"
                                        {...register('name')}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-400 text-sm">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white/90 text-sm font-medium">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl h-12"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-400 text-sm">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white/90 text-sm font-medium">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                    <Input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl h-12"
                                        {...register('number')}
                                    />
                                </div>
                                {errors.number && (
                                    <p className="text-red-400 text-sm">{errors.number.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white/90 text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        className="pl-12 pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl h-12"
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-sm">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-white/90 text-sm font-medium">Account Type</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${selectedRole === 'customer'
                                        ? 'border-emerald-400 bg-emerald-500/20'
                                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                                        }`}>
                                        <input
                                            type="radio"
                                            value="customer"
                                            className="sr-only"
                                            {...register('role')}
                                        />
                                        <div className="text-center">
                                            <ShoppingBag className="w-6 h-6 text-white mx-auto mb-2" />
                                            <span className="text-white text-sm font-medium">Customer</span>
                                        </div>
                                    </label>
                                    <label className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${selectedRole === 'owner'
                                        ? 'border-emerald-400 bg-emerald-500/20'
                                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                                        }`}>
                                        <input
                                            type="radio"
                                            value="owner"
                                            className="sr-only"
                                            {...register('role')}
                                        />
                                        <div className="text-center">
                                            <Crown className="w-6 h-6 text-white mx-auto mb-2" />
                                            <span className="text-white text-sm font-medium">Owner</span>
                                        </div>
                                    </label>
                                </div>
                                {errors.role && (
                                    <p className="text-red-400 text-sm">{errors.role.message}</p>
                                )}
                            </div>

                            {errors.root && (
                                <p className="text-red-400 text-sm text-center">{errors.root.message}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-glass hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-white/70">
                                Already have an account?{' '}
                                <Link href="/login" className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
