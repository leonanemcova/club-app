// app/(app)/dashboard/page.tsx
import { createServerSupabase } from '@/lib/supabase-server'
import { getSekce, katLabel, isHome, ROLE_INFO } from '@/types'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'

export default async function DashboardPage() {
  const supabase = createServerSupabase()
  const today = new Date().toISOString().slice(0, 10)

  const [{ data: matches }, { data: tasks }, { data: profiles }] = await Promise.all([
    supabase.from('matches').select('*, tasks:match_tasks(*)').gte('date', today).order('date').order('time').limit(50),
    supabase.from('match_tasks').select('*, assignee:profiles(name)'),
    supabase.from('profiles').select('*'),
  ])

  const todayMatches  = (matches || []).filter(m => m.date === today)
  const changedMatches = (matches || []).filter(m => m.changed)
  const allTasks      = tasks || []
  const missing       = allTasks.filter(t => !t.assignee_id).length
  const done          = allTasks.filter(t => t.status === 'hotovo').length

  const sCard = (label: string, value: number, sub: string, color: string, icon: string) => (
    <div key={label} className={`bg-white rounded-xl border border-slate-200 p-4 border-t-[3px]`} style={{ borderTopColor: color }}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-black" style={{ color }}>{value}</div>
          <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-semibold">{label}</div>
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: color + '15' }}>{icon}</div>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Přehled mediálního plánu FK Teplice</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {sCard('Nadcházející zápasy', (matches||[]).length, 'v sezóně', '#002FB9', '📅')}
        {sCard('Změny a upozornění', changedMatches.length, 'vyžadují pozornost', '#EF4444', '⚠️')}
        {sCard('Chybí přidělení', missing, 'úkolů bez přiřazení', '#F97316', '🔴')}
        {sCard('Hotovo', done, 'úkolů dokončeno', '#22C55E', '✅')}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Dnešní zápasy */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-900">Dnešní zápasy</h2>
            <span className="text-xs text-slate-400">{format(new Date(), 'd. MMMM yyyy', { locale: cs })}</span>
          </div>
          {todayMatches.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">Dnes žádné zápasy 🎉</p>
          ) : todayMatches.map(m => {
            const sec = getSekce(m.kategorie)
            const secColors: Record<string, string> = { muzi:'#FFC007', akademie:'#38BDF8', zeny:'#F472B6', pripravky:'#FB923C' }
            const col = secColors[sec] || '#38BDF8'
            return (
              <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
                <div className="w-1 h-9 rounded-full flex-shrink-0" style={{ background: col }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">{m.home} vs {m.away}</div>
                  <div className="text-xs text-slate-400">{m.time} · {katLabel(m.kategorie)} · {m.venue}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Nadcházející */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="font-bold text-slate-900 mb-4">Nadcházející zápasy</h2>
          <div className="space-y-2">
            {(matches || []).slice(0, 5).map(m => {
              const sec = getSekce(m.kategorie)
              const secColors: Record<string, string> = { muzi:'#FFC007', akademie:'#38BDF8', zeny:'#F472B6', pripravky:'#FB923C' }
              const col = secColors[sec] || '#38BDF8'
              const assignedTasks = (m.tasks || []).filter((t: any) => t.assignee_id)
              const pct = m.tasks?.length ? Math.round(assignedTasks.length / m.tasks.length * 100) : 0
              return (
                <div key={m.id} className="bg-slate-50 rounded-lg p-2.5 border-l-4" style={{ borderLeftColor: col }}>
                  <div className="flex justify-between items-center gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-slate-700">{katLabel(m.kategorie)} · {m.date} · {m.time}</div>
                      <div className="text-xs text-slate-500 truncate">{isHome(m) ? '🏠' : '✈️'} {m.home} vs {m.away}</div>
                    </div>
                    <div className="text-xs text-slate-400 flex-shrink-0">{assignedTasks.length}/{m.tasks?.length || 0}</div>
                  </div>
                  <div className="mt-1.5 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? '#22C55E' : col }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
