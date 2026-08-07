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
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200 flex flex-col">
      {/* Hero Section */}
      <div className="relative border-b border-white/5">
        <PixelHero 
          word1="Flux"
          word2="Guard."
          description="A robust rate limiter built using the Sliding Window algorithm with Redis. UI is sourced to be presentable, but the core system design, architecture, and logic are my own."
          primaryCta="View Dashboard"
          secondaryCta="Source Code"
          githubUrl="https://github.com/avanishkasar/FluxGuard"
          onPrimaryClick={handleHeroClick}
        />
        {/* Gradient fade transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none" />
      </div>

      {/* Dashboard Section */}
      <main id="dashboard" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 -mt-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              System Live
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight flex items-center gap-4">
              Traffic Monitor
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
              Monitoring incoming requests via sliding window. 
              Window is <b className="text-slate-200 font-semibold">60s</b>, 
              Limit is <b className="text-slate-200 font-semibold">10 req/IP</b>. 
              Auto-refreshing every 3s.
            </p>
          </div>
          {isDemoMode && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm font-medium shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              <ShieldAlert className="w-4 h-4" />
              Simulation Mode Active
            </div>
          )}
        </div>

        {/* Dashboard Table / Empty State */}
        {Object.keys(data).length === 0 ? (
          <div className="text-center py-32 border border-white/5 rounded-3xl bg-white/[0.01] backdrop-blur-xl shadow-2xl">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400 text-lg">Waiting for traffic...</p>
            <p className="text-slate-500 text-sm mt-2">Hit /api/search or /api/data to generate requests.</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#0f111a]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-8 py-5 font-semibold text-slate-300 text-sm uppercase tracking-widest">Client IP</th>
                    <th className="px-8 py-5 font-semibold text-slate-300 text-sm uppercase tracking-widest">Traffic (60s)</th>
                    <th className="px-8 py-5 font-semibold text-slate-300 text-sm uppercase tracking-widest">Capacity</th>
                    <th className="px-8 py-5 font-semibold text-slate-300 text-sm uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 font-semibold text-slate-300 text-sm uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {Object.keys(data).map(ip => {
                    const { requests_in_window, limit } = data[ip]
                    const pct = Math.round((requests_in_window / limit) * 100)
                    const isBlocked = pct >= 100
                    const isWarn = pct >= 70 && !isBlocked

                    return (
                      <tr key={ip} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isBlocked ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : isWarn ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
                            <span className="font-mono text-slate-200 font-medium tracking-wide">{ip}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-white">{requests_in_window}</span>
                            <span className="text-slate-500 font-medium">/ {limit}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="w-48 h-2.5 bg-[#020617] border border-white/5 rounded-full overflow-hidden relative">
                            <div 
                              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${
                                isBlocked ? 'bg-gradient-to-r from-red-600 to-red-400' : isWarn ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {isBlocked ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                              <ShieldAlert className="w-4 h-4" /> BLOCKED
                            </span>
                          ) : isWarn ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                              <Shield className="w-4 h-4" /> WARNING
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                              <ShieldCheck className="w-4 h-4" /> SECURE
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => resetIP(ip)}
                            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/20 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                          >
                            Reset IP
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 text-center text-sm font-medium tracking-wide text-slate-500 border-t border-white/5 bg-[#020617]/50 backdrop-blur-lg">
        FluxGuard &copy; {new Date().getFullYear()} &middot; Built with Sliding Window Algorithm &middot; Powered by Redis
      </footer>
    </div>
  )
}

export default App
