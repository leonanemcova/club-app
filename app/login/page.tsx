'use client'
// app/login/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [mode, setMode]         = useState<'login'|'register'>('login')
  const [name, setName]         = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name, role: 'fotograf', is_manager: false } }
      })
      if (error) setError(error.message)
      else setError('Zkontroluj e-mail pro potvrzení registrace.')
    }
    setLoading(false)
  }

  const inp = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-yellow-400 font-black text-xs">FKT</div>
          <div>
            <div className="font-black text-slate-900 text-sm tracking-wide">FK TEPLICE</div>
            <div className="text-slate-400 text-xs tracking-widest">MEDIA PLÁN</div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-1">
          {mode === 'login' ? 'Přihlášení' : 'Registrace'}
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          {mode === 'login' ? 'Přihlas se do mediálního plánu' : 'Vytvoř nový účet'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Celé jméno</label>
              <input className={inp} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jan Novák" required />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">E-mail</label>
            <input className={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jan@fkteplice.cz" required />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Heslo</label>
            <input className={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          {error && (
            <div className={`text-sm p-3 rounded-lg ${error.includes('potvrzení') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition-colors">
            {loading ? '⟳ Přihlašuji...' : mode === 'login' ? 'Přihlásit se' : 'Registrovat'}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500">
          {mode === 'login' ? (
            <>Nemáš účet?{' '}
              <button onClick={() => setMode('register')} className="text-blue-600 font-semibold hover:underline">Registrovat se</button>
            </>
          ) : (
            <>Máš účet?{' '}
              <button onClick={() => setMode('login')} className="text-blue-600 font-semibold hover:underline">Přihlásit se</button>
            </>
          )}
        </div>

        <div className="mt-6 p-3 bg-amber-50 rounded-lg text-xs text-amber-700">
          <strong>Admin účet:</strong> Prvního uživatele nastav jako manažera ručně v Supabase → Table Editor → profiles → is_manager = true
        </div>
      </div>
    </div>
  )
}
