// app/(app)/layout.tsx
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import Sidebar from '@/components/layout/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  // Počet změněných zápasů pro badge
  const { count: changesCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .eq('changed', true)

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar profile={profile} changesCount={changesCount || 0} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
