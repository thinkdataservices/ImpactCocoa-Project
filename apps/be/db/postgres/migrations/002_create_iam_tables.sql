CREATE TABLE IF NOT EXISTS iam.cooperatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  district_code TEXT NOT NULL,
  district_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS iam.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'locked')),
  default_cooperative_id UUID REFERENCES iam.cooperatives(id) ON DELETE SET NULL,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS iam.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS iam.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS iam.role_permissions (
  role_id UUID NOT NULL REFERENCES iam.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES iam.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS iam.user_roles (
  user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES iam.roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS iam.user_cooperative_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE CASCADE,
  assignment_scope TEXT NOT NULL DEFAULT 'district' CHECK (assignment_scope IN ('district', 'all_districts')),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, cooperative_id)
);

CREATE TABLE IF NOT EXISTS iam.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS iam.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
  token_id UUID NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_iam_users_status ON iam.users(status);
CREATE INDEX IF NOT EXISTS idx_iam_users_default_cooperative_id ON iam.users(default_cooperative_id);
CREATE INDEX IF NOT EXISTS idx_iam_user_coop_assignments_user_id ON iam.user_cooperative_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_iam_user_coop_assignments_cooperative_id ON iam.user_cooperative_assignments(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_iam_sessions_user_id ON iam.sessions(user_id);
