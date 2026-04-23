// app/api/tasks/[id]/route.ts
import { createServerSupabase } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { status, note, assignee_id } = body

  // Ověř že může editovat (svůj úkol nebo manager)
  const { data: task } = await supabase
    .from('match_tasks').select('assignee_id').eq('id', params.id).single()
  const { data: profile } = await supabase
    .from('profiles').select('is_manager').eq('id', user.id).single()

  const canEdit = profile?.is_manager || task?.assignee_id === user.id
  if (!canEdit) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const updates: Record<string, any> = {}
  if (status      !== undefined) updates.status      = status
  if (note        !== undefined) updates.note        = note
  if (assignee_id !== undefined && profile?.is_manager) updates.assignee_id = assignee_id

  const { data, error } = await supabase
    .from('match_tasks').update(updates).eq('id', params.id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
