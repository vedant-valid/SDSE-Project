'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { clearSession, getUser } from '@/lib/api'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  const handleSignout = () => {
    clearSession()
    setUser(null)
    router.push('/')
  }

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-surface border-b border-gold/20"
      aria-label="Main navigation"
    >
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide">
        <img src="/logo.svg" alt="logo" className="w-6 h-6 object-contain" />
        <span className="text-amber font-serif">Deepa&apos;s Vision</span>
      </Link>

      {user ? (
        /* Logged-in nav */
        <div className="flex items-center gap-6">
          <span className="text-cosmic text-sm hidden md:block">
            नमस्ते, <span className="text-starlight">{user.name.split(' ')[0]}</span>
          </span>
          <Link
            href="/birth-chart"
            className="text-xs tracking-widest text-cosmic hover:text-gold transition-colors duration-200"
          >
            KUNDALI
          </Link>
          <Link
            href="/dosha"
            className="text-xs tracking-widest text-cosmic hover:text-gold transition-colors duration-200"
          >
            DOSHA CHECK
          </Link>
          <Link
            href="/dashboard"
            className="text-xs tracking-widest text-cosmic hover:text-gold transition-colors duration-200"
          >
            DASHBOARD
          </Link>
          <button
            onClick={handleSignout}
            className="hidden md:inline-flex items-center px-4 py-2 text-xs tracking-wider border border-gold/40 text-cosmic hover:border-gold hover:text-gold transition-colors duration-200"
          >
            SIGN OUT
          </button>
        </div>
      ) : (
        /* Guest nav */
        <div className="flex items-center gap-4">
          <Link
            href="/auth/signin"
            className="text-xs tracking-widest text-cosmic hover:text-gold transition-colors duration-200"
          >
            SIGN IN
          </Link>
          <Link
            href="/auth/signup"
            className="hidden md:inline-flex items-center px-5 py-2 text-sm tracking-wider border border-saffron text-saffron hover:bg-saffron hover:text-white transition-colors duration-200"
          >
            Let&apos;s Sit
          </Link>
        </div>
      )}
    </nav>
  )
}
