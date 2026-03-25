CREATE TABLE IF NOT EXISTS integration.kobo_submissions_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_code TEXT NOT NULL,
  submission_uuid TEXT NOT NULL UNIQUE,
  cooperative_id UUID REFERENCES iam.cooperatives(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  submitted_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ,
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'failed', 'ignored')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration.sync_cursors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_system TEXT NOT NULL,
  source_key TEXT NOT NULL,
  last_cursor TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_system, source_key)
);

CREATE TABLE IF NOT EXISTS integration.sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_system TEXT NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  processed_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration.sync_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_job_id UUID REFERENCES integration.sync_jobs(id) ON DELETE SET NULL,
  source_reference TEXT,
  error_message TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration.migration_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_system TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  summary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration.reconciliation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_job_id UUID NOT NULL REFERENCES integration.migration_jobs(id) ON DELETE CASCADE,
  entity_name TEXT NOT NULL,
  source_count INTEGER NOT NULL DEFAULT 0,
  target_count INTEGER NOT NULL DEFAULT 0,
  mismatch_count INTEGER NOT NULL DEFAULT 0,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_integration_kobo_submissions_raw_form_code ON integration.kobo_submissions_raw(form_code);
CREATE INDEX IF NOT EXISTS idx_integration_kobo_submissions_raw_status ON integration.kobo_submissions_raw(processing_status);
CREATE INDEX IF NOT EXISTS idx_integration_sync_jobs_status ON integration.sync_jobs(status);
CREATE INDEX IF NOT EXISTS idx_integration_sync_errors_sync_job_id ON integration.sync_errors(sync_job_id);
