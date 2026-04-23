// types/index.ts

export type Role = 'fotograf' | 'kameraman' | 'clanek' | 'socialni'
export type TaskStatus = 'ceka' | 'probiha' | 'hotovo'
export type SecId = 'muzi' | 'akademie' | 'zeny' | 'pripravky'

export interface Profile {
  id: string
  name: string
  role: Role
  is_manager: boolean
  avatar_url?: string
}

export interface MatchTask {
  id: number
  match_id: number
  role: Role
  assignee_id: string | null
  status: TaskStatus
  note: string
  assignee?: Profile
}

export interface Match {
  id: number
  date: string        // YYYY-MM-DD
  time: string        // HH:MM
  home: string
  away: string
  kategorie: string
  venue: string
  notes: string
  changed: boolean
  tasks?: MatchTask[]
}

export interface ClubEvent {
  id: number
  type: 'klubova' | 'mimoradna' | 'partnerska' | 'treninky'
  title: string
  date: string
  time_range: string
  venue: string
  note: string
  kategorie: string[]
  tasks?: { id: number; role: Role; status: TaskStatus }[]
}

export interface MediaItem {
  id: number
  match_id: number | null
  type: 'zapas' | 'foto' | 'video' | 'clanek' | 'social' | 'newsletter'
  title: string
  platform: string[]
  status: 'plan' | 'inprogress' | 'done' | 'missed'
  date: string
  time: string
  assignee_id: string | null
  note: string
  kategorie: string
  assignee?: Profile
}

// Konstanty sdílené s frontendem
export const SEKCE: { id: SecId; label: string; color: string; kategorie: string[] }[] = [
  { id: 'muzi',      label: 'Muži',      color: '#FFC007', kategorie: ['Muži A','Muži B'] },
  { id: 'akademie',  label: 'Akademie',  color: '#38BDF8', kategorie: ['U19','U18','U17','U16','U15','U14','U13','U12'] },
  { id: 'zeny',      label: 'Ženy',      color: '#F472B6', kategorie: ['Ženy A','Ženy B','WU18','WU15','WU13','WU11','WU9'] },
  { id: 'pripravky', label: 'Přípravky', color: '#FB923C', kategorie: ['U11','U10','U9','U8','U6/U7'] },
]

export const KAT_PARY: [string, string][] = [
  ['U19','U17'], ['U18','U16'], ['U15','U14'], ['U13','U12']
]

export const ROLE_INFO: Record<Role, { label: string; icon: string }> = {
  fotograf:  { label: 'Fotograf',  icon: '📷' },
  kameraman: { label: 'Kameraman', icon: '🎥' },
  clanek:    { label: 'Článek',    icon: '✍️' },
  socialni:  { label: 'Soc. sítě', icon: '📱' },
}

export function getSekce(kategorie: string): SecId {
  const k = kategorie.toLowerCase().trim()
  if (k.startsWith('wu') || k.includes('ženy') || k.includes('zeny')) return 'zeny'
  if (['u19','u18','u17','u16','u15','u14','u13','u12'].includes(k)) return 'akademie'
  if (['u11','u10','u9','u8','u7','u6'].some(x => k === x || k.startsWith(x))) return 'pripravky'
  return 'muzi'
}

export function katLabel(kat: string): string {
  const par = KAT_PARY.find(p => p.includes(kat))
  return par ? `${par[0]}/${par[1]}` : kat
}

export function isHome(match: Match): boolean {
  return match.home.toLowerCase().includes('teplice')
}
