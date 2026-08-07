import { useEffect, useState } from 'react'
import { PixelHero } from './components/ui/pixel-perfect-hero'
import { GitBranch, Activity, ShieldAlert, ShieldCheck, Shield } from 'lucide-react'

type IPStats = {
  requests_in_window: number
  limit: number
  remaining: number
}

type MockData = Record<string, IPStats>

const initialMockData: MockData = {
  '192.168.1.105': { requests_in_window: 2, limit: 10, remaining: 8 },
  '10.0.0.42': { requests_in_window: 8, limit: 10, remaining: 2 },
  '172.16.254.1': { requests_in_window: 10, limit: 10, remaining: 0 },
  '13.120.44.11': { requests_in_window: 0, limit: 10, remaining: 10 }
}

function App() {
  const [data, setData] = useState<MockData>({})
  const [isDemoMode, setIsDemoMode] = useState(false)

  const refresh = async () => {
    try {
      const res = await fetch('/stats')
      if (!res.ok) throw new Error('Backend offline')
      const json = await res.json()
      setData(json)
      setIsDemoMode(false)
    } catch (err) {
      if (!isDemoMode) setIsDemoMode(true)
      setData(prev => {
        const newData = Object.keys(prev).length ? { ...prev } : { ...initialMockData }
        Object.keys(newData).forEach(ip => {
          const stats = { ...newData[ip] }
          if (Math.random() > 0.4) stats.requests_in_window = Math.min(15, stats.requests_in_window + Math.floor(Math.random() * 4))
          if (Math.random() > 0.7 && stats.requests_in_window > 0) stats.requests_in_window = Math.max(0, stats.requests_in_window - Math.floor(Math.random() * 5))
          stats.remaining = Math.max(0, stats.limit - stats.requests_in_window)
          newData[ip] = stats
        })
        return newData
      })
    }
  }

  const resetIP = async (ip: string) => {
    if (isDemoMode) {
      setData(prev => ({
        ...prev,
        [ip]: { ...prev[ip], requests_in_window: 0, remaining: prev[ip].limit }
      }))
      return
    }
    await fetch('/reset/' + ip, { method: 'POST' })
    refresh()
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 3000)
    return () => clearInterval(interval)
  }, [isDemoMode])

  const handleHeroClick = () => {
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <PixelHero 
        word1="Flux"
        word2="Guard."
        description="A robust rate limiter built using the Sliding Window algorithm with Redis. UI is sourced to be presentable, but the core system design, architecture, and logic are my own."
        primaryCta="View Dashboard"
        secondaryCta="Source Code"
        githubUrl="https://github.com/avanishkasar/FluxGuard"
        onPrimaryClick={handleHeroClick}
      />

      <main id="dashboard" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-500" />
              Live Traffic
            </h2>
            <p className="text-slate-400 mt-2 text-sm max-w-xl">
              Monitoring incoming requests. Window is <b className="text-slate-300">60s</b>, Limit is <b className="text-slate-300">10 req / IP</b>. Auto-refreshing every 3s.
            </p>
          </div>
          {isDemoMode && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium">
              <ShieldAlert className="w-4 h-4" />
              Simulation Mode (No Backend)
            </div>
          )}
        </div>

        {Object.keys(data).length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/[0.02]">
            <p className="text-slate-500">No traffic yet. Hit /api/search or /api/data to see IPs appear.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0f1117] shadow-2xl">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#1a1f2c] border-b border-white/10 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">IP Address</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Requests (last 60s)</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Usage</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {Object.keys(data).map(ip => {
                  const { requests_in_window, limit } = data[ip]
                  const pct = Math.round((requests_in_window / limit) * 100)
                  const isBlocked = pct >= 100
                  const isWarn = pct >= 70 && !isBlocked

                  return (
                    <tr key={ip} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5 font-mono text-slate-300">{ip}</td>
                      <td className="px-6 py-5">
                        <span className="text-white font-medium">{requests_in_window}</span>
                        <span className="text-slate-500"> / {limit}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="w-40 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                              isBlocked ? 'bg-red-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                            <ShieldAlert className="w-3.5 h-3.5" /> BLOCKED
                          </span>
                        ) : isWarn ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Shield className="w-3.5 h-3.5" /> WARNING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3.5 h-3.5" /> OK
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => resetIP(ip)}
                          className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/20"
                        >
                          Reset
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="py-8 text-center text-sm text-slate-500 border-t border-white/10">
        FluxGuard · Sliding Window Algorithm · fakeredis
      </footer>
    </div>
  )
}

export default App
