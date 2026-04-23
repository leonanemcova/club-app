// app/page.tsx – Club Management App homepage
// Next.js 14 App Router · TypeScript · Tailwind CSS
import Link from 'next/link'

const MATCHES = [
  { tag: 'Muži A',  cls: 'm-tag-r', home: 'FK Teplice', away: 'Hradec',    time: '16:00' },
  { tag: 'U19/U17', cls: 'm-tag-b', home: 'Jablonec',   away: 'Teplice',   time: '10:15' },
  { tag: 'Ženy A',  cls: 'm-tag-g', home: 'FK Teplice', away: 'Dynamo ČB', time: '14:00' },
]

const FEATURES = [
  { icon: '✅', title: 'Úkoly týmu',    desc: 'Fotograf, kameraman, článek, social. Každý vidí jen své.' },
  { icon: '📅', title: 'Kalendář',      desc: 'Měsíční přehled s filtry. Párové kategorie na jednom řádku.' },
  { icon: '📄', title: 'Export .docx',  desc: 'Word dokument jedním klikem. Landscape, barevné sekce.' },
  { icon: '📊', title: 'Google Sheets', desc: 'Apps Script. 7 záložek, úkoly, statistiky, filtry.' },
  { icon: '🔔', title: 'Centrum změn',  desc: 'Live kontrola změn zápasů. Badge v sidebaru.' },
]

const TICKER_ITEMS = [
  'Správa zápasů','Mediální plán','Export .docx','Google Sheets',
  'Centrum změn','Přiřazení úkolů','Týmové role','Kalendář','Real-time sync',
]

export default function HomePage() {
  return (
    <>
      {/* Nav */}
      <nav className="nav">
        <Link href="/" className="logo">
          <div className="logo-mark">CMA</div>
          <span className="logo-name">ClubManager</span>
        </Link>
        <div className="nav-links">
          <Link href="/login"    className="btn-ghost">Přihlásit se</Link>
          <Link href="/register" className="btn-solid">Registrovat →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div>
          <div className="badge a1">
            <span className="badge-dot" />
            Sezóna 2025/2026 – aktivní
          </div>
          <h1 className="h1 a2">
            Club<br />Management<br /><em>App.</em>
          </h1>
          <p className="lead a3">
            Kompletní platforma pro sportovní kluby. Správa zápasů, mediálního
            plánu, úkolů a reportů — sdílené s celým týmem v reálném čase.
          </p>
          <div className="cta-row a4">
            <Link href="/login" className="btn-primary">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Přihlásit se
            </Link>
            <Link href="/register" className="btn-outline">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM20 8v6M23 11h-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Registrovat se
            </Link>
          </div>
        </div>

        {/* Floating card */}
        <div className="a5">
          <div className="card">
            <div className="card-label">Dnešní program</div>
            {MATCHES.map(m => (
              <div key={m.tag} className="match-row">
                <span className={`m-tag ${m.cls}`}>{m.tag}</span>
                <div className="m-teams">
                  {m.home}<span>vs</span>{m.away}
                </div>
                <span className="m-time">{m.time}</span>
              </div>
            ))}
            <div className="card-stats">
              {[['146','Zápasů'],['6','Členů'],['4','Sekce']].map(([n,l]) => (
                <div key={l} className="stat">
                  <div className="stat-n">{n}</div>
                  <div className="stat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map(i => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {TICKER_ITEMS.map(t => (
                <span key={t} className="t-item">
                  {t}<span className="t-dot" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="features">
        <div className="feat-header">
          <div>
            <div className="sec-tag">Funkce</div>
            <h2 className="sec-h2">Vše co váš klub potřebuje</h2>
          </div>
          <div className="feat-num">06</div>
        </div>
        <div className="feat-grid">
          {/* Featured wide card */}
          <div className="feat-card feat-wide">
            <div className="feat-icon">⚽</div>
            <div>
              <div className="feat-title">Kompletní správa zápasů</div>
              <div className="feat-desc">
                146 reálných zápasů, filtrování podle sekce a kategorie, párování
                U19/U17, turnajový formát WU9/WU11, centrum změn s automatickou
                kontrolou webu.
              </div>
            </div>
          </div>
          {/* Regular cards */}
          {FEATURES.map(f => (
            <div key={f.title} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="cta-wrap">
        <div className="cta-box">
          <div>
            <div className="cta-h">Připraveni začít?<br />Přidejte celý tým.</div>
            <div className="cta-s">Zdarma · Vercel + Supabase · Nasazení za 30 minut</div>
          </div>
          <div className="cta-btns">
            <Link href="/register" className="btn-cta1">Registrovat se →</Link>
            <Link href="/login"    className="btn-cta2">Přihlásit se</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>© 2026 Club Management App</span>
        <span>Next.js 14 · TypeScript · Tailwind CSS · Supabase</span>
      </footer>
    </>
  )
}
