CREATE TABLE IF NOT EXISTS audit.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id UUID REFERENCES iam.users(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  entity_schema TEXT NOT NULL,
  entity_table TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  cooperative_id UUID REFERENCES iam.cooperatives(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit.entity_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_log_id BIGINT NOT NULL REFERENCES audit.audit_logs(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit.report_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_run_id UUID REFERENCES reporting.report_runs(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES iam.users(id) ON DELETE SET NULL,
  report_code TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_target ON audit.audit_logs(entity_schema, entity_table, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_entity_changes_audit_log_id ON audit.entity_changes(audit_log_id);
CREATE INDEX IF NOT EXISTS idx_audit_report_audit_logs_report_run_id ON audit.report_audit_logs(report_run_id);
