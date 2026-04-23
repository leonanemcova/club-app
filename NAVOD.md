# FK Teplice – Mediální plán
## Kompletní návod: Supabase + Vercel (sdílení s týmem)

---

## Co získáš

- ✅ Celá aplikace online na vlastní URL (např. `fkteplice-media.vercel.app`)
- ✅ Každý člen týmu má vlastní login a heslo
- ✅ Data sdílená v reálném čase – všichni vidí stejné zápasy a úkoly
- ✅ Manažer přidává/mění zápasy, členové aktualizují své úkoly
- ✅ Zdarma (Vercel free + Supabase free tier)

---

## KROK 1 – Supabase (databáze + login)

### 1.1 Vytvoř projekt
1. Jdi na **https://supabase.com** → Sign up (zdarma)
2. **New project** → pojmenuj ho `fkteplice-media`
3. Zvol heslo pro databázi (ulož si ho) a region **Frankfurt (eu-central-1)**
4. Počkej ~2 minuty na inicializaci

### 1.2 Spusť databázové schéma
1. V Supabase levém menu klikni **SQL Editor**
2. Klikni **New query**
3. Otevři soubor `supabase_schema.sql` z tohoto balíčku
4. Zkopíruj celý obsah a vlož do SQL Editoru
5. Klikni **Run** (▶️)
6. Měl bys vidět `Success. No rows returned.`

### 1.3 Nastav e-mail přihlášení
1. **Authentication → Providers → Email** → ujisti se že je zapnutý
2. **Authentication → URL Configuration**:
   - Site URL: `https://tvuj-projekt.vercel.app` (doplň po nasazení)
   - Redirect URLs: přidej `https://tvuj-projekt.vercel.app/dashboard`

### 1.4 Zjisti API klíče
1. **Settings → API**
2. Zkopíruj:
   - **Project URL** → bude `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → bude `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → bude `SUPABASE_SERVICE_ROLE_KEY` (jen pro seed script)

---

## KROK 2 – GitHub (verzování kódu)

### 2.1 Vytvoř repozitář
1. Jdi na **https://github.com** → New repository
2. Pojmenuj ho `fkteplice-media`, nastav na **Private**
3. Klikni **Create repository**

### 2.2 Nahrej projekt
```bash
# Rozbal ZIP a přejdi do složky
cd fkteplice-app

# Inicializuj Git a nahrej
git init
git add .
git commit -m "FK Teplice Media Plan – initial commit"
git branch -M main
git remote add origin https://github.com/tvoje-jmeno/fkteplice-media.git
git push -u origin main
```

---

## KROK 3 – Vercel (hosting)

### 3.1 Propoj s GitHubem
1. Jdi na **https://vercel.com** → Sign up with GitHub (zdarma)
2. **Add New Project** → vyber repozitář `fkteplice-media`
3. Framework: **Next.js** (detekuje automaticky)

### 3.2 Nastav environment variables
V sekci **Environment Variables** přidej:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tvoje Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tvoje anon/public key |

4. Klikni **Deploy** → počkej ~2 minuty
5. Dostaneš URL jako `fkteplice-media.vercel.app`

### 3.3 Aktualizuj Supabase URL
Vrať se do Supabase → Authentication → URL Configuration:
- Site URL: `https://fkteplice-media.vercel.app`
- Redirect URLs: `https://fkteplice-media.vercel.app/dashboard`

---

## KROK 4 – Import dat ze stávající aplikace

### 4.1 Nastav service role key lokálně
```bash
# Vytvoř .env.local ze šablony
cp .env.local.example .env.local
```
Otevři `.env.local` a doplň:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  ← jen pro seed, NIKDY nesdílej
```

### 4.2 Spusť import zápasů
```bash
npm install
npx ts-node -r tsconfig-paths/register scripts/seed.ts
```
Uvidíš výstup:
```
🌱 FK Teplice – Import dat do Supabase
📊 Importuji 22 zápasů...
  ✓ 10 zápasů importováno...
  ✓ 20 zápasů importováno...
✅ Hotovo! 22 zápasů importováno, 0 chyb.
```

> **Tip:** Seed script obsahuje základní sadu zápasů. Zbytek 146 zápasů přidej přes UI aplikace nebo doplň do `scripts/seed.ts`.

---

## KROK 5 – Registrace a nastavení týmu

### 5.1 Zaregistruj manažerský účet
1. Otevři `https://fkteplice-media.vercel.app/login`
2. Klikni **Registrovat se**
3. Zadej jméno, e-mail a heslo

### 5.2 Nastav manažerská práva
1. V Supabase jdi na **Table Editor → profiles**
2. Najdi svůj řádek (podle e-mailu v auth.users)
3. Nastav `is_manager = true`
4. Ulož

### 5.3 Pozvi členy týmu
Každý člen:
1. Otevře `https://fkteplice-media.vercel.app/login`
2. Klikne **Registrovat se** a vyplní jméno + e-mail + heslo
3. Dostane potvrzovací e-mail
4. Po přihlášení vidí zápasy a může aktualizovat své úkoly

Ty jako manažer pak v **Supabase → Table Editor → profiles** nastavíš každému správnou roli (`fotograf`, `kameraman`, `clanek`, `socialni`).

---

## Struktura projektu

```
fkteplice-app/
├── app/
│   ├── (app)/              ← Chráněné stránky (vyžadují login)
│   │   ├── layout.tsx      ← Sidebar + auth check
│   │   └── dashboard/      ← Dashboard
│   ├── api/
│   │   ├── matches/        ← GET/POST zápasy
│   │   └── tasks/[id]/     ← PATCH úkoly
│   ├── login/              ← Přihlášení / registrace
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── layout/
│       └── Sidebar.tsx     ← Navigace
├── lib/
│   ├── supabase.ts         ← Klient pro prohlížeč
│   └── supabase-server.ts  ← Klient pro server
├── types/index.ts           ← TypeScript typy
├── middleware.ts            ← Auth ochrana cest
├── scripts/seed.ts          ← Import dat
├── supabase_schema.sql      ← Databázové schéma
└── .env.local.example       ← Vzor proměnných
```

---

## Lokální vývoj

```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev

# Otevři http://localhost:3000
```

---

## Aktualizace aplikace

Jakákoli změna pushnutá na GitHub se **automaticky nasadí** na Vercel:
```bash
git add .
git commit -m "Přidán nový feature"
git push
# → Vercel automaticky přebuilí a nasadí za ~1 minutu
```

---

## Cena

| Služba | Free tier | Platí se za |
|--------|-----------|-------------|
| Vercel | 100GB bandwidth/měsíc | Víc projektů, vlastní doména s SSL |
| Supabase | 500MB DB, 50k auth users | Víc DB prostoru |

Pro FK Teplice media tým (6 lidí) je **free tier naprosto dostačující**.

---

## Kontakt a podpora

Aplikace je postavena na:
- **Next.js 14** (App Router)
- **Supabase** (PostgreSQL + Auth + Realtime)
- **Tailwind CSS**
- **TypeScript**

Kód je čistý a rozšiřitelný. Každá nová funkce = nová stránka v `app/(app)/`.
