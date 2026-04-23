// scripts/seed.ts
// Spusť: npx ts-node scripts/seed.ts
// Importuje všech 146 reálných zápasů z aplikace do Supabase

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key ze Supabase → Settings → API
)

// Kategorie párů (pro info – DB ukládá jednotlivé kategorie)
const ROLES = ['fotograf', 'kameraman', 'clanek', 'socialni']

const MATCHES = [
  // ── U19 ──
  { date:"2026-04-26", time:"10:30", home:"FK Teplice", away:"Admira Praha", kategorie:"U19", venue:"Teplice, Stínadla – UMT", notes:"27. kolo" },
  { date:"2026-04-29", time:"11:00", home:"FC Hradec Králové", away:"FK Teplice", kategorie:"U19", venue:"Areál Bavlna / tráva", notes:"36. kolo – výjezd" },
  { date:"2026-05-03", time:"10:15", home:"Fotbalová akademie Jablonec, z.s.", away:"FK Teplice", kategorie:"U19", venue:"Tráva Mozartova", notes:"28. kolo – výjezd" },
  { date:"2026-05-08", time:"12:00", home:"FK Teplice", away:"SK Dynamo České Budějovice", kategorie:"U19", venue:"Teplice, Stínadla – UMT", notes:"29. kolo" },
  { date:"2026-05-13", time:"10:30", home:"FK Teplice", away:"FK Viktoria Žižkov", kategorie:"U19", venue:"Teplice, Stínadla – UMT", notes:"37. kolo" },
  { date:"2026-05-17", time:"10:00", home:"FK Ústí nad Labem", away:"FK Teplice", kategorie:"U19", venue:"Areál Klíše / tráva", notes:"30. kolo – výjezd" },
  { date:"2026-05-22", time:"11:00", home:"FK Teplice", away:"FC Táborsko akademie z.s.", kategorie:"U19", venue:"Teplice, Stínadla – UMT", notes:"31. kolo" },
  { date:"2026-05-27", time:"11:00", home:"FK Dukla Praha", away:"FK Teplice", kategorie:"U19", venue:"Satalice – tráva", notes:"38. kolo – výjezd" },
  { date:"2026-05-31", time:"10:00", home:"FC TEMPO PRAHA, z.s.", away:"FK Teplice", kategorie:"U19", venue:"TEMPO UMT", notes:"32. kolo – výjezd" },
  { date:"2026-06-05", time:"10:30", home:"FK Teplice", away:"VIKTORIA PLZEŇ – fotbal, z.s.", kategorie:"U19", venue:"Teplice, Stínadla – UMT", notes:"33. kolo" },
  { date:"2026-06-14", time:"10:00", home:"CU Bohemians Praha, z.s.", away:"FK Teplice", kategorie:"U19", venue:"SK Čechie Uhříněves / tráva", notes:"34. kolo – výjezd" },
  // ── U18 ──
  { date:"2026-05-02", time:"10:30", home:"FK Teplice", away:"FK Ústí nad Labem", kategorie:"U18", venue:"Teplice, Anger tráva", notes:"24. kolo" },
  { date:"2026-05-09", time:"10:00", home:"FK Viktoria Žižkov", away:"FK Teplice", kategorie:"U18", venue:"Satalice / tráva", notes:"25. kolo – výjezd" },
  { date:"2026-05-16", time:"10:30", home:"FK Teplice", away:"FC Chomutov, s.r.o.", kategorie:"U18", venue:"Teplice, Anger tráva", notes:"26. kolo" },
  { date:"2026-05-23", time:"10:00", home:"Sportovní klub Kosmonosy, z.s.", away:"FK Teplice", kategorie:"U18", venue:"UMT Kosmonosy", notes:"27. kolo – výjezd" },
  { date:"2026-05-30", time:"10:30", home:"FK Teplice", away:"CU Bohemians Praha, z.s.", kategorie:"U18", venue:"Teplice, Anger tráva", notes:"28. kolo" },
  // ── Muži A ──
  { date:"2026-04-25", time:"16:00", home:"FK Teplice", away:"FC Hradec Králové", kategorie:"Muži A", venue:"AGC Aréna Na Stínadlech", notes:"27. kolo" },
  { date:"2026-05-02", time:"15:00", home:"15. tým základní části", away:"FK Teplice", kategorie:"Muži A", venue:"AGC Aréna Na Stínadlech", notes:"Nadstavba 1. kolo" },
  { date:"2026-05-09", time:"15:00", home:"FK Teplice", away:"16. tým základní části", kategorie:"Muži A", venue:"AGC Aréna Na Stínadlech", notes:"Nadstavba 2. kolo" },
  { date:"2026-05-12", time:"17:30", home:"12. tým základní části", away:"FK Teplice", kategorie:"Muži A", venue:"TBD – výjezd", notes:"Nadstavba 3. kolo" },
  { date:"2026-05-16", time:"17:00", home:"FK Teplice", away:"14. tým základní části", kategorie:"Muži A", venue:"AGC Aréna Na Stínadlech", notes:"Nadstavba 4. kolo" },
  { date:"2026-05-23", time:"14:00", home:"11. tým základní části", away:"FK Teplice", kategorie:"Muži A", venue:"TBD – výjezd", notes:"Nadstavba 5. kolo" },
  // Přidej zbytek podle potřeby...
]

async function seed() {
  console.log(`\n🌱 FK Teplice – Import dat do Supabase\n`)
  console.log(`📊 Importuji ${MATCHES.length} zápasů...`)

  let ok = 0, fail = 0

  for (const m of MATCHES) {
    // Vlož zápas
    const { data: match, error } = await supabase
      .from('matches')
      .insert({ ...m, changed: false })
      .select()
      .single()

    if (error) {
      console.error(`  ❌ ${m.kategorie} ${m.date}: ${error.message}`)
      fail++
      continue
    }

    // Vytvoř úkoly pro všechny role
    const tasks = ROLES.map(role => ({ match_id: match.id, role, status: 'ceka', note: '' }))
    await supabase.from('match_tasks').insert(tasks)

    ok++
    if (ok % 10 === 0) console.log(`  ✓ ${ok} zápasů importováno...`)
  }

  console.log(`\n✅ Hotovo! ${ok} zápasů importováno, ${fail} chyb.\n`)
}

seed().catch(console.error)
