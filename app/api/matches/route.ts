// app/api/matches/route.ts
import { createServerSupabase } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createServerSupabase()
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to   = searchParams.get('to')
  const kat  = searchParams.get('kategorie')

  let query = supabase
    .from('matches')
    .select(`*, tasks:match_tasks(*, assignee:profiles(id,name,role))`)
    .order('date').order('time')

  if (from) query = query.gte('date', from)
  if (to)   query = query.lte('date', to)
  if (kat)  query = query.eq('kategorie', kat)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('is_manager').eq('id', user.id).single()
  if (!profile?.is_manager) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { tasks, ...matchData } = body

  // Vložení zápasu
  const { data: match, error } = await supabase
    .from('matches')
    .insert({ ...matchData, created_by: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Automatické vytvoření úkolů pro všechny role
  const roles = ['fotograf', 'kameraman', 'clanek', 'socialni']
  const taskInserts = roles.map(role => ({ match_id: match.id, role, status: 'ceka', note: '' }))
  await supabase.from('match_tasks').insert(taskInserts)

  return NextResponse.json(match, { status: 201 })
}
