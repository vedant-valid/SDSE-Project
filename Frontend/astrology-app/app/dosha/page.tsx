'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api, getUser } from '@/lib/api'

const DOSHA_TYPES = [
  { id: 'manglik',   label: 'Manglik Dosha',  desc: 'Mars placement affecting marriage & relationships' },
  { id: 'kalsarp',   label: 'Kaal Sarp Dosha', desc: 'All planets between Rahu & Ketu — challenges and growth' },
  { id: 'sadesati',  label: 'Sade Sati',       desc: 'Saturn transit over Moon — a transformative 7.5-year cycle' },
  { id: 'pitradosh', label: 'Pitra Dosha',     desc: 'Ancestral karma affecting life path and progeny' },
  { id: 'nadi',      label: 'Nadi Dosha',      desc: 'Compatibility dosha significant in marriage matching' },
]

interface DoshaReport {
  _id: string
  doshaType: string
  severity: string
  isPresent: boolean
  createdAt: string
  report?: Record<string, unknown>
}

export default function DoshaPage() {
  const router = useRouter()
  const user = getUser()

  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [reports, setReports] = useState<DoshaReport[]>([])
  const [selected, setSelected] = useState<DoshaReport | null>(null)
  const [checking, setChecking] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    const [profileRes, doshaRes] = await Promise.all([
      api.profile.get(),
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001'}/api/dosha/search`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('dv_token')}` },
      }).then((r) => r.json()),
    ])
    setHasProfile(profileRes.success && !!profileRes.data)
    if (doshaRes.success) {
      const list: DoshaReport[] = doshaRes.data ?? []
      setReports(list)
      if (list.length > 0 && !selected) setSelected(list[0])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!user) { router.push('/auth/signin'); return }
    loadData()
  }, [])

  const handleCheck = async (doshaType: string) => {
    setError('')
    setChecking(doshaType)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001'}/api/dosha/check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('dv_token')}`,
          },
          body: JSON.stringify({ doshaType }),
        }
      )
      const data = await res.json()
      if (!data.success) { setError(data.message ?? 'Check failed'); return }
      await loadData()
      if (data.data) setSelected(data.data)
    } catch {
      setError('Could not connect to server')
    } finally {
      setChecking(null)
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

      <div className="max-w-6xl mx-auto px-8 py-12">
        <p className="text-xs tracking-[3px] uppercase text-amber mb-1">ग्रह दोष</p>
        <h1 className="font-serif text-3xl text-amber mb-2">Dosha Check</h1>
        <p className="text-cosmic text-sm mb-8">
          Select a dosha to check its presence in your birth chart.
        </p>

        {!loading && hasProfile === false && (
          <div className="bg-surface border border-gold/20 p-8 text-center mb-8">
            <p className="text-amber font-serif text-xl mb-2">Profile Required</p>
            <p className="text-cosmic text-sm mb-4">Create your birth profile to run a Dosha check.</p>
            <Link href="/profile/create" className="inline-flex px-6 py-3 bg-saffron text-white text-sm hover:bg-saffron/80 transition-colors">
              Create Profile →
            </Link>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/10 px-4 py-3 mb-6">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dosha type cards */}
          <div className="flex flex-col gap-3">
            <p className="text-cosmic text-xs tracking-widest uppercase mb-1">Choose Dosha</p>
            {DOSHA_TYPES.map((d) => {
              const existing = reports.find((r) => r.doshaType === d.id)
              return (
                <div
                  key={d.id}
                  className="bg-surface border border-gold/20 p-4 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-starlight text-sm font-medium">{d.label}</p>
                      <p className="text-cosmic text-xs mt-0.5">{d.desc}</p>
                    </div>
                    {existing && (
                      <span
                        className={`text-xs px-2 py-0.5 shrink-0 ${
                          existing.isPresent ? 'bg-crimson/40 text-red-300' : 'bg-green-900/40 text-green-300'
                        }`}
                      >
                        {existing.isPresent ? 'Present' : 'Clear'}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleCheck(d.id)}
                      disabled={checking === d.id || !hasProfile}
                      className="text-xs px-3 py-1.5 bg-saffron text-white hover:bg-saffron/80 disabled:opacity-40 transition-colors"
                    >
                      {checking === d.id ? 'Checking...' : existing ? 'Re-check' : 'Check'}
                    </button>
                    {existing && (
                      <button
                        onClick={() => setSelected(existing)}
                        className="text-xs px-3 py-1.5 border border-gold/30 text-amber hover:border-gold/60 transition-colors"
                      >
                        View Report
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Report display */}
          <div className="lg:col-span-2">
            {selected ? (
              <DoshaReportCard report={selected} />
            ) : (
              <div className="bg-surface border border-gold/20 p-8 text-center text-cosmic h-full flex items-center justify-center">
                <p>Select a dosha to check or view a saved report.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DoshaReportCard({ report }: { report: DoshaReport }) {
  const type = DOSHA_TYPES.find((d) => d.id === report.doshaType)
  const severityColor =
    report.severity === 'high' ? 'text-red-400' :
    report.severity === 'medium' ? 'text-amber' : 'text-green-400'

  return (
    <div className="bg-surface border border-gold/20 p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-amber text-xs uppercase tracking-widest">{report.doshaType}</p>
          <p className="font-serif text-xl text-starlight mt-1">{type?.label ?? report.doshaType}</p>
          <p className="text-cosmic text-xs mt-1">
            Checked: {new Date(report.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`text-sm font-semibold px-3 py-1 border ${
              report.isPresent
                ? 'border-red-400/40 bg-red-400/10 text-red-400'
                : 'border-green-400/40 bg-green-400/10 text-green-400'
            }`}
          >
            {report.isPresent ? '⚠ Dosha Present' : '✓ Dosha Clear'}
          </span>
          <p className={`text-xs mt-2 capitalize ${severityColor}`}>
            Severity: {report.severity}
          </p>
        </div>
      </div>

      {report.report && Object.keys(report.report).length > 0 ? (
        <ReportDetails data={report.report} />
      ) : (
        <p className="text-cosmic text-sm">No additional details available.</p>
      )}
    </div>
  )
}

function ReportDetails({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined)

  return (
    <div className="flex flex-col gap-4">
      {entries.map(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          return (
            <div key={key}>
              <p className="text-amber text-xs uppercase tracking-widest mb-2">
                {key.replace(/_/g, ' ')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                  <div key={k} className="bg-raised px-3 py-2">
                    <p className="text-cosmic text-xs capitalize">{k.replace(/_/g, ' ')}</p>
                    <p className="text-starlight text-sm">{String(v)}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        }
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div key={key}>
              <p className="text-amber text-xs uppercase tracking-widest mb-2">
                {key.replace(/_/g, ' ')}
              </p>
              <ul className="flex flex-col gap-1">
                {value.map((item, i) => (
                  <li key={i} className="text-starlight/80 text-sm flex gap-2">
                    <span className="text-gold">·</span>
                    {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
        return (
          <div key={key} className="bg-raised px-4 py-3">
            <p className="text-cosmic text-xs capitalize">{key.replace(/_/g, ' ')}</p>
            <p className="text-starlight text-sm">{String(value)}</p>
          </div>
        )
      })}
    </div>
  )
}
