-- ═══════════════════════════════════════════════════════════
--  FK TEPLICE – Supabase databázové schéma
--  Zkopíruj a spusť v Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Profily uživatelů (rozšíření auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT DEFAULT 'fotograf', -- fotograf | kameraman | clanek | socialni | manager
  is_manager  BOOLEAN DEFAULT false,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Zápasy
CREATE TABLE IF NOT EXISTS matches (
  id          BIGSERIAL PRIMARY KEY,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  home        TEXT NOT NULL,
  away        TEXT NOT NULL,
  kategorie   TEXT NOT NULL,
  venue       TEXT,
  notes       TEXT,
  changed     BOOLEAN DEFAULT false,
  created_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Úkoly k zápasům
CREATE TABLE IF NOT EXISTS match_tasks (
  id          BIGSERIAL PRIMARY KEY,
  match_id    BIGINT REFERENCES matches(id) ON DELETE CASCADE,
  role        TEXT NOT NULL, -- fotograf | kameraman | clanek | socialni
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status      TEXT DEFAULT 'ceka', -- ceka | probiha | hotovo
  note        TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Akce (klubové, mimořádné, partnerské)
CREATE TABLE IF NOT EXISTS events (
  id          BIGSERIAL PRIMARY KEY,
  type        TEXT NOT NULL, -- klubova | mimoradna | partnerska | treninky
  title       TEXT NOT NULL,
  date        DATE NOT NULL,
  time_range  TEXT, -- "10:00–15:00"
  venue       TEXT,
  note        TEXT,
  kategorie   TEXT[],  -- pole kategorií
  created_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Úkoly k akcím
CREATE TABLE IF NOT EXISTS event_tasks (
  id          BIGSERIAL PRIMARY KEY,
  event_id    BIGINT REFERENCES events(id) ON DELETE CASCADE,
  role        TEXT NOT NULL,
  status      TEXT DEFAULT 'ceka',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Mediální plán
CREATE TABLE IF NOT EXISTS media_items (
  id          BIGSERIAL PRIMARY KEY,
  match_id    BIGINT REFERENCES matches(id) ON DELETE SET NULL,
  type        TEXT NOT NULL, -- zapas | foto | video | clanek | social | newsletter
  title       TEXT NOT NULL,
  platform    TEXT[],
  status      TEXT DEFAULT 'plan', -- plan | inprogress | done | missed
  date        DATE,
  time        TIME,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  note        TEXT,
  kategorie   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexy ────────────────────────────────────────────────────
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_matches_kategorie ON matches(kategorie);
CREATE INDEX idx_match_tasks_match_id ON match_tasks(match_id);
CREATE INDEX idx_match_tasks_assignee ON match_tasks(assignee_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_media_items_date ON media_items(date);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Profily: každý vidí všechny, edituje jen svůj
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Zápasy: všichni přihlášení vidí, manager přidává/mění
CREATE POLICY "matches_select" ON matches FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "matches_insert" ON matches FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_manager = true)
);
CREATE POLICY "matches_update" ON matches FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_manager = true)
);
CREATE POLICY "matches_delete" ON matches FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_manager = true)
);

-- Úkoly: všichni vidí, svůj stav mění každý, vše mění manager
CREATE POLICY "tasks_select" ON match_tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "tasks_insert" ON match_tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "tasks_update" ON match_tasks FOR UPDATE USING (
  assignee_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_manager = true)
);

-- Akce a média: stejná pravidla
CREATE POLICY "events_select" ON events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "events_all"    ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_manager = true)
);
CREATE POLICY "event_tasks_select" ON event_tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "event_tasks_all"    ON event_tasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "media_select" ON media_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "media_all"    ON media_items FOR ALL USING (auth.role() = 'authenticated');

-- ── Trigger: auto-update updated_at ──────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER matches_updated_at     BEFORE UPDATE ON matches     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER match_tasks_updated_at BEFORE UPDATE ON match_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at      BEFORE UPDATE ON events      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER media_updated_at       BEFORE UPDATE ON media_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Trigger: auto-create profile po registraci ───────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role, is_manager)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'fotograf'),
    COALESCE((NEW.raw_user_meta_data->>'is_manager')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
