// app/page.tsx – Club Management App homepage
// Next.js 14 App Router · TypeScript · Tailwind CSS
import Link from 'next/link'
 
export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --ink:    #0A0A0F;
          --paper:  #F5F3EE;
          --accent: #FF4D1C;
          --blue:   #0038FF;
          --muted:  #8A8880;
          --border: rgba(10,10,15,0.10);
        }
        body {
          background: var(--paper);
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }
        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 99; opacity: 0.35;
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes floatCard { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-10px) rotate(1.5deg); } }
        @keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.75); } }
        .a1 { animation: fadeUp .65s .00s both; }
        .a2 { animation: fadeUp .65s .08s both; }
        .a3 { animation: fadeUp .65s .16s both; }
        .a4 { animation: fadeUp .65s .24s both; }
        .a5 { animation: fadeUp .65s .32s both; }
 
        /* ── Nav ── */
        .nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 40px;
          background: rgba(245,243,238,.88);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
        }
        .logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
        .logo-mark {
          width:32px; height:32px; border-radius:8px;
          background: var(--ink);
          display:flex; align-items:center; justify-content:center;
          font-family:'Syne',sans-serif; font-size:9px; font-weight:800;
          color:#FFD600; letter-spacing:.04em; flex-shrink:0;
        }
        .logo-name {
          font-family:'Syne',sans-serif; font-weight:800; font-size:13px;
          letter-spacing:.1em; text-transform:uppercase; color:var(--ink);
        }
        .nav-links { display:flex; align-items:center; gap:6px; }
        .btn-ghost {
          padding:8px 18px; font-size:13px; font-weight:500;
          color:var(--muted); background:none; border:none;
          border-radius:8px; cursor:pointer; text-decoration:none;
          transition:color .15s;
        }
        .btn-ghost:hover { color:var(--ink); }
        .btn-solid {
          padding:9px 20px; font-size:13px; font-weight:600;
          color:var(--paper); background:var(--ink); border:none;
          border-radius:8px; cursor:pointer; text-decoration:none;
          transition:opacity .15s, transform .1s;
        }
        .btn-solid:hover { opacity:.85; transform:translateY(-1px); }
 
        /* ── Hero ── */
        .hero {
          max-width:1100px; margin:0 auto;
          padding:72px 40px 56px;
          display:grid; grid-template-columns:1fr 360px;
          gap:56px; align-items:start;
        }
        .badge {
          display:inline-flex; align-items:center; gap:7px;
          font-size:11px; font-weight:600; letter-spacing:.08em;
          text-transform:uppercase; color:var(--muted);
          margin-bottom:22px;
        }
        .badge-dot {
          width:7px; height:7px; background:var(--accent);
          border-radius:50%; animation:pulseDot 2s ease-in-out infinite;
        }
        .h1 {
          font-family:'Syne',sans-serif; font-weight:800;
          font-size:clamp(42px,5.5vw,74px);
          line-height:1.0; letter-spacing:-.03em;
          color:var(--ink); margin-bottom:22px;
        }
        .h1 em { font-style:normal; color:var(--accent); }
        .lead {
          font-size:16px; line-height:1.65;
          color:var(--muted); font-weight:300;
          max-width:450px; margin-bottom:36px;
        }
        .cta-row { display:flex; gap:12px; flex-wrap:wrap; }
        .btn-primary {
          padding:13px 30px; font-size:14px; font-weight:600;
          color:#fff; background:var(--accent); border:none;
          border-radius:10px; cursor:pointer; text-decoration:none;
          display:inline-flex; align-items:center; gap:8px;
          box-shadow:0 4px 20px rgba(255,77,28,.28);
          transition:all .15s;
        }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(255,77,28,.38); }
        .btn-primary:active { transform:translateY(0); }
        .btn-outline {
          padding:13px 30px; font-size:14px; font-weight:500;
          color:var(--ink); background:transparent;
          border:1.5px solid var(--border);
          border-radius:10px; cursor:pointer; text-decoration:none;
          display:inline-flex; align-items:center; gap:8px;
          transition:all .15s;
        }
        .btn-outline:hover { background:rgba(10,10,15,.04); border-color:rgba(10,10,15,.18); }
 
        /* ── Floating card ── */
        .card {
          background:var(--ink); border-radius:20px; padding:26px;
          animation:floatCard 6s ease-in-out infinite;
          position:relative; overflow:hidden;
        }
        .card::before {
          content:''; position:absolute;
          top:-40px; right:-30px; width:180px; height:180px;
          background:var(--blue); border-radius:50%;
          opacity:.1; filter:blur(40px);
        }
        .card-label {
          font-size:10px; font-weight:700; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(255,255,255,.28);
          margin-bottom:14px;
        }
        .match-row {
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.07);
          border-radius:11px; padding:12px 14px;
          margin-bottom:7px;
          display:flex; align-items:center; gap:10px;
        }
        .m-tag {
          font-size:9px; font-weight:700; letter-spacing:.07em;
          text-transform:uppercase; padding:3px 8px;
          border-radius:99px; white-space:nowrap;
        }
        .m-tag-r { background:rgba(255,77,28,.18); color:#FF6B42; }
        .m-tag-b { background:rgba(0,56,255,.15);  color:#4D7AFF; }
        .m-tag-g { background:rgba(34,197,94,.15); color:#4ADE80; }
        .m-teams {
          font-family:'Syne',sans-serif; font-size:11px; font-weight:700;
          color:#fff; flex:1;
        }
        .m-teams span { color:rgba(255,255,255,.3); font-weight:400; margin:0 4px; }
        .m-time { font-size:11px; font-weight:600; color:rgba(255,255,255,.35); white-space:nowrap; }
        .card-stats {
          margin-top:18px; display:grid;
          grid-template-columns:repeat(3,1fr); gap:7px;
        }
        .stat {
          background:rgba(255,255,255,.05); border-radius:10px;
          padding:11px 8px; text-align:center;
        }
        .stat-n {
          font-family:'Syne',sans-serif; font-size:20px;
          font-weight:800; color:#fff; line-height:1; margin-bottom:3px;
        }
        .stat-l {
          font-size:8px; font-weight:700; letter-spacing:.08em;
          text-transform:uppercase; color:rgba(255,255,255,.25);
        }
 
        /* ── Ticker ── */
        .ticker { border-top:1px solid var(--border); border-bottom:1px solid var(--border); padding:11px 0; overflow:hidden; white-space:nowrap; background:rgba(10,10,15,.025); }
        .ticker-track { display:inline-flex; animation:marquee 28s linear infinite; }
        .t-item { display:inline-flex; align-items:center; gap:8px; padding:0 28px; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }
        .t-dot { width:4px; height:4px; background:var(--accent); border-radius:50%; margin-left:28px; flex-shrink:0; }
 
        /* ── Features ── */
        .features { max-width:1100px; margin:0 auto; padding:72px 40px; }
        .feat-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:44px; }
        .sec-tag { font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); margin-bottom:8px; }
        .sec-h2 { font-family:'Syne',sans-serif; font-size:clamp(26px,3.5vw,38px); font-weight:800; letter-spacing:-.02em; color:var(--ink); }
        .feat-num { font-family:'Syne',sans-serif; font-size:60px; font-weight:800; color:rgba(10,10,15,.05); line-height:1; }
        .feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .feat-card {
          padding:26px; border:1.5px solid var(--border);
          border-radius:14px; background:rgba(255,255,255,.5);
          transition:all .2s;
        }
        .feat-card:hover { transform:translateY(-3px); box-shadow:0 10px 36px rgba(10,10,15,.08); background:#fff; border-color:rgba(10,10,15,.18); }
        .feat-card.wide { grid-column:span 2; background:var(--ink); border-color:var(--ink); display:flex; align-items:flex-start; gap:28px; }
        .feat-card.wide:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(10,10,15,.25); }
        .feat-icon { width:42px; height:42px; background:rgba(10,10,15,.06); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:18px; flex-shrink:0; }
        .feat-card.wide .feat-icon { background:rgba(255,255,255,.08); }
        .feat-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:var(--ink); margin-bottom:7px; }
        .feat-card.wide .feat-title { color:#fff; font-size:20px; }
        .feat-desc { font-size:13px; line-height:1.6; color:var(--muted); font-weight:300; }
        .feat-card.wide .feat-desc { color:rgba(255,255,255,.45); font-size:13.5px; }
 
        /* ── Bottom CTA ── */
        .cta-wrap { max-width:1100px; margin:0 auto 72px; padding:0 40px; }
        .cta-box {
          background:var(--ink); border-radius:22px; padding:56px 60px;
          display:flex; align-items:center; justify-content:space-between;
          gap:40px; position:relative; overflow:hidden;
        }
        .cta-box::before { content:''; position:absolute; top:-80px; right:80px; width:350px; height:350px; background:var(--blue); border-radius:50%; opacity:.07; filter:blur(70px); }
        .cta-box::after  { content:''; position:absolute; bottom:-70px; right:-30px; width:280px; height:280px; background:var(--accent); border-radius:50%; opacity:.07; filter:blur(60px); }
        .cta-h { font-family:'Syne',sans-serif; font-size:clamp(22px,2.8vw,34px); font-weight:800; color:#fff; letter-spacing:-.02em; line-height:1.2; }
        .cta-s { font-size:13px; color:rgba(255,255,255,.38); margin-top:9px; font-weight:300; }
        .cta-btns { display:flex; gap:10px; flex-shrink:0; flex-wrap:wrap; }
        .btn-cta1 { padding:13px 26px; font-size:13px; font-weight:700; color:var(--ink); background:var(--paper); border:none; border-radius:9px; cursor:pointer; text-decoration:none; white-space:nowrap; transition:opacity .15s,transform .1s; }
        .btn-cta1:hover { opacity:.9; transform:translateY(-1px); }
        .btn-cta2 { padding:13px 26px; font-size:13px; font-weight:500; color:rgba(255,255,255,.55); background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1); border-radius:9px; cursor:pointer; text-decoration:none; white-space:nowrap; transition:all .15s; }
        .btn-cta2:hover { background:rgba(255,255,255,.11); color:#fff; }
 
        /* ── Footer ── */
        .footer { border-top:1px solid var(--border); padding:22px 40px; display:flex; align-items:center; justify-content:space-between; font-size:12px; color:var(--muted); max-width:1100px; margin:0 auto; }
 
        /* ── Responsive ── */
        @media (max-width:900px) {
          .nav { padding:16px 20px; }
          .hero { grid-template-columns:1fr; gap:36px; padding:48px 20px 36px; }
          .card { display:none; }
          .features { padding:48px 20px; }
          .feat-grid { grid-template-columns:1fr 1fr; }
          .feat-card.wide { grid-column:span 2; flex-direction:column; gap:0; }
          .cta-box { padding:36px 28px; flex-direction:column; align-items:flex-start; }
          .footer { padding:18px 20px; flex-direction:column; gap:6px; text-align:center; }
        }
        @media (max-width:600px) {
          .feat-grid { grid-template-columns:1fr; }
          .feat-card.wide { grid-column:span 1; }
          .feat-header { flex-direction:column; align-items:flex-start; }
          .feat-num { display:none; }
          .cta-row { flex-direction:column; }
          .btn-primary, .btn-outline { width:100%; justify-content:center; }
        }
      `}</style>
 
      {/* ── Nav ── */}
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
 
      {/* ── Hero ── */}
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
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Přihlásit se
            </Link>
            <Link href="/register" className="btn-outline">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM20 8v6M23 11h-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Registrovat se
            </Link>
          </div>
        </div>
 
        {/* floating card */}
        <div className="a5">
          <div className="card">
            <div className="card-label">Dnešní program</div>
            {([
              { tag:'Muži A',  cls:'m-tag-r', h:'FK Teplice', a:'Hradec',   t:'16:00' },
              { tag:'U19/U17', cls:'m-tag-b', h:'Jablonec',   a:'Teplice',  t:'10:15' },
              { tag:'Ženy A',  cls:'m-tag-g', h:'FK Teplice', a:'Dynamo ČB',t:'14:00' },
            ] as const).map(m => (
              <div key={m.tag} className="match-row">
                <span className={`m-tag ${m.cls}`}>{m.tag}</span>
                <div className="m-teams">{m.h}<span>vs</span>{m.a}</div>
                <span className="m-time">{m.t}</span>
              </div>
            ))}
            <div className="card-stats">
              {[['146','Zápasů'],['6','Členů'],['4','Sekce']] as const).map(([n,l]) => (
                <div key={l} className="stat">
                  <div className="stat-n">{n}</div>
                  <div className="stat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      {/* ── Ticker ── */}
      <div className="ticker" aria-hidden>
        <div className="ticker-track">
          {[...Array(2)].map((_,i) => (
            <span key={i} style={{display:'inline-flex',alignItems:'center'}}>
              {['Správa zápasů','Mediální plán','Export .docx','Google Sheets','Centrum změn','Přiřazení úkolů','Týmové role','Kalendář','Real-time sync'].map(t=>(
                <span key={t} className="t-item">{t}<span className="t-dot"/></span>
              ))}
            </span>
          ))}
        </div>
      </div>
 
      {/* ── Features ── */}
      <section className="features">
        <div className="feat-header">
          <div>
            <div className="sec-tag">Funkce</div>
            <h2 className="sec-h2">Vše co váš klub potřebuje</h2>
          </div>
          <div className="feat-num">06</div>
        </div>
        <div className="feat-grid">
          <div className="feat-card wide">
            <div className="feat-icon">⚽</div>
            <div>
              <div className="feat-title">Kompletní správa zápasů</div>
              <div className="feat-desc">146 reálných zápasů, filtrování podle sekce a kategorie, párování U19/U17, turnajový formát WU9/WU11, centrum změn s automatickou kontrolou webu.</div>
            </div>
          </div>
          {[
            {icon:'✅',t:'Úkoly týmu',    d:'Fotograf, kameraman, článek, social. Každý vidí jen své.'},
            {icon:'📅',t:'Kalendář',      d:'Měsíční přehled s filtry. Párové kategorie na jednom řádku.'},
            {icon:'📄',t:'Export .docx',  d:'Word dokument jedním klikem. Landscape, barevné sekce.'},
            {icon:'📊',t:'Google Sheets', d:'Apps Script. 7 záložek, úkoly, statistiky, filtry.'},
            {icon:'🔔',t:'Centrum změn',  d:'Live kontrola změn zápasů. Badge v sidebaru.'},
          ].map(f=>(
            <div key={f.t} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.t}</div>
              <div className="feat-desc">{f.d}</div>
            </div>
          ))}
        </div>
      </section>
 
      {/* ── Bottom CTA ── */}
      <section className="cta-wrap">
        <div className="cta-box">
          <div>
            <div className="cta-h">Připraveni začít?<br/>Přidejte celý tým.</div>
            <div className="cta-s">Zdarma · Vercel + Supabase · Nasazení za 30 minut</div>
          </div>
          <div className="cta-btns">
            <Link href="/register" className="btn-cta1">Registrovat se →</Link>
            <Link href="/login"    className="btn-cta2">Přihlásit se</Link>
          </div>
        </div>
      </section>
 
      {/* ── Footer ── */}
      <footer className="footer">
        <span>© 2026 Club Management App</span>
        <span>Next.js 14 · TypeScript · Tailwind CSS · Supabase</span>
      </footer>
    </>
  )
}
