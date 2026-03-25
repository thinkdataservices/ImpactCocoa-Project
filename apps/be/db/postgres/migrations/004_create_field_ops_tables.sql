CREATE TABLE IF NOT EXISTS field_ops.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE RESTRICT,
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE RESTRICT,
  inspection_year INTEGER NOT NULL,
  inspection_date DATE NOT NULL,
  inspector_user_id UUID REFERENCES iam.users(id) ON DELETE SET NULL,
  compliance_status TEXT NOT NULL DEFAULT 'pending',
  score NUMERIC(5,2),
  certification_status TEXT,
  source_submission_uuid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (farmer_id, inspection_year)
);

CREATE TABLE IF NOT EXISTS field_ops.inspection_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES field_ops.inspections(id) ON DELETE CASCADE,
  requirement_code TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'minor' CHECK (severity IN ('minor', 'major', 'critical')),
  finding_status TEXT NOT NULL DEFAULT 'open' CHECK (finding_status IN ('open', 'resolved', 'waived')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_ops.follow_up_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES field_ops.inspections(id) ON DELETE SET NULL,
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE RESTRICT,
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE RESTRICT,
  assigned_to_user_id UUID REFERENCES iam.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done', 'cancelled')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_ops.training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID REFERENCES iam.cooperatives(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  objectives TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_ops.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES field_ops.training_modules(id) ON DELETE RESTRICT,
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE RESTRICT,
  facilitator_user_id UUID REFERENCES iam.users(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_ops.training_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES field_ops.training_sessions(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE RESTRICT,
  attendance_status TEXT NOT NULL DEFAULT 'attended' CHECK (attendance_status IN ('attended', 'absent', 'excused')),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, farmer_id)
);

CREATE TABLE IF NOT EXISTS field_ops.coaching_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE RESTRICT,
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE RESTRICT,
  coach_user_id UUID REFERENCES iam.users(id) ON DELETE SET NULL,
  visit_date DATE NOT NULL,
  attendees_count INTEGER,
  summary TEXT,
  actions_agreed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_ops.farm_development_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE RESTRICT,
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE RESTRICT,
  created_by_user_id UUID REFERENCES iam.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  plan_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_ops.coaching_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coaching_visit_id UUID NOT NULL REFERENCES field_ops.coaching_visits(id) ON DELETE CASCADE,
  progress_summary TEXT,
  next_steps TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_field_ops_inspections_farmer_id ON field_ops.inspections(farmer_id);
CREATE INDEX IF NOT EXISTS idx_field_ops_inspections_cooperative_id ON field_ops.inspections(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_field_ops_follow_up_actions_farmer_id ON field_ops.follow_up_actions(farmer_id);
CREATE INDEX IF NOT EXISTS idx_field_ops_follow_up_actions_status ON field_ops.follow_up_actions(status);
CREATE INDEX IF NOT EXISTS idx_field_ops_training_sessions_cooperative_id ON field_ops.training_sessions(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_field_ops_training_attendance_farmer_id ON field_ops.training_attendance(farmer_id);
CREATE INDEX IF NOT EXISTS idx_field_ops_coaching_visits_farmer_id ON field_ops.coaching_visits(farmer_id);
CREATE INDEX IF NOT EXISTS idx_field_ops_farm_development_plans_farmer_id ON field_ops.farm_development_plans(farmer_id);
