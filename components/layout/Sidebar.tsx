'use client'
// components/layout/Sidebar.tsx
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/types'

const NAV = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/zapasy',    icon: '⚽', label: 'Zápasy' },
  { href: '/kalendar',  icon: '🗓', label: 'Kalendář' },
  { href: '/ukoly',     icon: '✓',  label: 'Úkoly' },
  { href: '/tym',       icon: '👥', label: 'Tým' },
  { href: '/mediaplan', icon: '📣', label: 'Mediální plán' },
  { href: '/akce',      icon: '🎯', label: 'Akce' },
  { href: '/zmeny',     icon: '🔔', label: 'Centrum změn' },
  { href: '/export',    icon: '📄', label: 'Export .docx' },
  { href: '/sheets',    icon: '📊', label: 'Google Sheets' },
]

export default function Sidebar({ profile, changesCount = 0 }: { profile: Profile; changesCount?: number }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-48 min-w-[192px] bg-slate-900 flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-yellow-400 font-black text-[10px]">FKT</div>
          <div>
            <div className="text-white font-black text-[11px] tracking-wider">FK TEPLICE</div>
            <div className="text-slate-500 text-[9px] tracking-widest">MEDIA PLÁN</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all ${
                active ? 'bg-blue-900/60 text-white font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.href === '/zmeny' && changesCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{changesCount}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[12px] font-semibold truncate">{profile.name}</div>
            <div className="text-slate-500 text-[10px]">{profile.is_manager ? '👑 Manažer' : profile.role}</div>
          </div>
        </div>
        <button onClick={logout} className="w-full text-left text-slate-500 hover:text-slate-300 text-[11px] px-1 transition-colors">
          ← Odhlásit se
        </button>
      </div>
    </aside>
  )
}
