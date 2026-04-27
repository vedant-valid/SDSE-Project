'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api, getUser } from '@/lib/api'

export default function CreateProfilePage() {
  const router = useRouter()
  const user = getUser()
  const [form, setForm] = useState({
    name: '',
    gender: 'male',
    dateOfBirth: '',
    timeOfBirth: '',
    city: '',
    state: '',
    country: '',
    timezone: '+5.5',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) router.push('/auth/signin')
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.profile.create(form)
      if (!res.success) {
        setError(res.message ?? 'Failed to create profile')
        return
      }
      router.push('/birth-chart')
    } catch {
      setError('Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-void text-starlight">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-surface border-b border-gold/20">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="w-6 h-6 object-contain" />
          <span className="text-amber font-serif">Deepa&apos;s Vision</span>
        </Link>
        <Link href="/dashboard" className="text-xs tracking-widest text-cosmic hover:text-gold transition-colors">
          ← DASHBOARD
        </Link>
      </nav>

      <div className="max-w-xl mx-auto px-8 py-12">
        <p className="text-xs tracking-[3px] uppercase text-amber mb-1">जन्म विवरण</p>
        <h1 className="font-serif text-3xl text-amber mb-2">Create Your Profile</h1>
        <p className="text-cosmic text-sm mb-8">
          Your birth details are used to generate an accurate Vedic chart.
        </p>

        <form onSubmit={handleSubmit} className="bg-surface border border-gold/20 p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-cosmic text-xs tracking-wide">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="As per birth records"
              className="bg-raised border border-gold/20 text-starlight px-4 py-3 text-sm focus:outline-none focus:border-gold/60 placeholder:text-cosmic/50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-cosmic text-xs tracking-wide">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="bg-raised border border-gold/20 text-starlight px-4 py-3 text-sm focus:outline-none focus:border-gold/60"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-cosmic text-xs tracking-wide">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
                className="bg-raised border border-gold/20 text-starlight px-4 py-3 text-sm focus:outline-none focus:border-gold/60"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-cosmic text-xs tracking-wide">Time of Birth (24h)</label>
              <input
                name="timeOfBirth"
                type="time"
                value={form.timeOfBirth}
                onChange={handleChange}
                required
                className="bg-raised border border-gold/20 text-starlight px-4 py-3 text-sm focus:outline-none focus:border-gold/60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-cosmic text-xs tracking-wide">City of Birth</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="e.g. Mumbai"
              className="bg-raised border border-gold/20 text-starlight px-4 py-3 text-sm focus:outline-none focus:border-gold/60 placeholder:text-cosmic/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-cosmic text-xs tracking-wide">State (optional)</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
                className="bg-raised border border-gold/20 text-starlight px-4 py-3 text-sm focus:outline-none focus:border-gold/60 placeholder:text-cosmic/50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-cosmic text-xs tracking-wide">Country</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                placeholder="e.g. India"
                className="bg-raised border border-gold/20 text-starlight px-4 py-3 text-sm focus:outline-none focus:border-gold/60 placeholder:text-cosmic/50"
              />
            </div>
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
            {loading ? 'Saving...' : 'SAVE PROFILE & GENERATE KUNDALI'}
          </button>
        </form>
      </div>
    </div>
  )
}
