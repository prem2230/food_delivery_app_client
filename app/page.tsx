'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { ArrowRight, Star, Users, Clock } from 'lucide-react'
import { Header } from '@/components/layout/Header'

export default function Home() {
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      {/* Hero Section */}
      <main className="relative">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-glass rounded-full mb-8 animate-glow">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 text-sm">Rated #1 Food Delivery App</span>
            </div>

            <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Delicious Food,
              <span className="gradient-text">
                {' '}Delivered Fast
              </span>
            </h2>

            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Order from your favorite restaurants and get it delivered to your doorstep in minutes.
              Fresh, fast, and always delicious.
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/register">
                  <Button size="lg" className="gradient-primary text-white px-8 py-4 text-lg rounded-xl shadow-glass hover:shadow-glow transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="border-white/20 text-white bg-glass-hover px-8 py-4 text-lg rounded-xl cursor-pointer">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="bg-glass rounded-2xl p-6 shadow-glass hover:shadow-glow transition-all duration-300">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/70">Happy Customers</div>
              </div>
              <div className="bg-glass rounded-2xl p-6 shadow-glass hover:shadow-glow transition-all duration-300">
                <Clock className="w-8 h-8 text-pink-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">15 min</div>
                <div className="text-white/70">Average Delivery</div>
              </div>
              <div className="bg-glass rounded-2xl p-6 shadow-glass hover:shadow-glow transition-all duration-300">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">4.9</div>
                <div className="text-white/70">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
