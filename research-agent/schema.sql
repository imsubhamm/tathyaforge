PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY,
  run_date TEXT NOT NULL UNIQUE,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'partial', 'failed')),
  qualified_count INTEGER NOT NULL DEFAULT 0,
  demo_count INTEGER NOT NULL DEFAULT 0,
  failure_reason TEXT
);

CREATE TABLE IF NOT EXISTS businesses (
  id INTEGER PRIMARY KEY,
  canonical_name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  website TEXT,
  normalized_domain TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  latitude REAL,
  longitude REAL,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  UNIQUE(normalized_domain),
  UNIQUE(normalized_name, city)
);

CREATE TABLE IF NOT EXISTS opportunities (
  id INTEGER PRIMARY KEY,
  run_id INTEGER NOT NULL REFERENCES runs(id),
  business_id INTEGER NOT NULL REFERENCES businesses(id),
  industry TEXT,
  observed_problems TEXT NOT NULL,
  current_solution TEXT,
  proposed_solution TEXT NOT NULL,
  contact_name TEXT,
  contact_role TEXT,
  public_email TEXT,
  public_phone TEXT,
  linkedin_url TEXT,
  estimated_budget_low_inr INTEGER,
  estimated_budget_high_inr INTEGER,
  budget_reasoning TEXT,
  confidence INTEGER NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  priority TEXT NOT NULL CHECK (priority IN ('P1', 'P2', 'P3', 'REJECT')),
  conversion_reasoning TEXT,
  demo_type TEXT,
  demo_path TEXT,
  outreach_draft TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(run_id, business_id)
);

CREATE TABLE IF NOT EXISTS evidence (
  id INTEGER PRIMARY KEY,
  opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_type TEXT,
  claim TEXT NOT NULL,
  observed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_business_domain ON businesses(normalized_domain);
CREATE INDEX IF NOT EXISTS idx_business_name_city ON businesses(normalized_name, city);
CREATE INDEX IF NOT EXISTS idx_opportunity_priority ON opportunities(run_id, priority, score DESC);
