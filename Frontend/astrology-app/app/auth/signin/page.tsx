'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api, saveSession } from '@/lib/api'

export default function SigninPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.auth.signin(form)
      if (!res.success || !res.data) {
        setError(res.message ?? 'Invalid credentials')
        return
      }
      saveSession(res.data.token, res.data.user)
      router.push('/dashboard')
    } catch {
      setError('Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <img src="/logo.svg" alt="logo" className="w-7 h-7 object-contain" />
          <span className="text-amber font-serif text-xl">Deepa&apos;s Vision</span>
        </Link>

        <div className="bg-surface border border-gold/20 p-8">
          <p className="text-xs tracking-[3px] uppercase text-amber mb-1">वापस आएं</p>
          <h1 className="font-serif text-2xl text-amber mb-6">Sign In</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-cosmic text-xs tracking-wide">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="bg-raised border border-gold/20 text-starlight px-4 py-3 text-sm focus:outline-none focus:border-gold/60 placeholder:text-cosmic/50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-cosmic text-xs tracking-wide">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Your password"
                className="bg-raised border border-gold/20 text-starlight px-4 py-3 text-sm focus:outline-none focus:border-gold/60 placeholder:text-cosmic/50"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/10 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-saffron text-white py-3 text-sm tracking-widest hover:bg-saffron/80 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>

          <p className="text-cosmic text-sm text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-amber hover:text-gold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
