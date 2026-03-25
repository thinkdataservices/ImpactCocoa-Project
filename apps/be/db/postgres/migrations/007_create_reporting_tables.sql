CREATE TABLE IF NOT EXISTS reporting.report_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_code TEXT NOT NULL,
  requested_by_user_id UUID REFERENCES iam.users(id) ON DELETE SET NULL,
  cooperative_id UUID REFERENCES iam.cooperatives(id) ON DELETE SET NULL,
  district_scope TEXT,
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_format TEXT NOT NULL CHECK (output_format IN ('pdf', 'excel', 'csv', 'json')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reporting.report_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_run_id UUID NOT NULL REFERENCES reporting.report_runs(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reporting.dashboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID REFERENCES iam.cooperatives(id) ON DELETE SET NULL,
  snapshot_type TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cooperative_id, snapshot_type, snapshot_date)
);

CREATE TABLE IF NOT EXISTS reporting.traceability_report_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID REFERENCES iam.cooperatives(id) ON DELETE SET NULL,
  season TEXT NOT NULL,
  payload JSONB NOT NULL,
  refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cooperative_id, season)
);

CREATE TABLE IF NOT EXISTS reporting.inspection_report_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID REFERENCES iam.cooperatives(id) ON DELETE SET NULL,
  inspection_year INTEGER NOT NULL,
  payload JSONB NOT NULL,
  refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cooperative_id, inspection_year)
);

CREATE INDEX IF NOT EXISTS idx_reporting_report_runs_status ON reporting.report_runs(status);
CREATE INDEX IF NOT EXISTS idx_reporting_report_runs_report_code ON reporting.report_runs(report_code);
CREATE INDEX IF NOT EXISTS idx_reporting_report_files_report_run_id ON reporting.report_files(report_run_id);
