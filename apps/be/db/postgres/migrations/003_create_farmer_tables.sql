CREATE TABLE IF NOT EXISTS farmer.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE RESTRICT,
  farmer_code TEXT NOT NULL UNIQUE,
  external_source TEXT,
  external_ref TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  sex TEXT CHECK (sex IN ('male', 'female', 'other', 'unknown')),
  date_of_birth DATE,
  phone_number TEXT,
  national_id_number TEXT,
  certification_status TEXT NOT NULL DEFAULT 'unknown',
  registration_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (external_source, external_ref)
);

CREATE TABLE IF NOT EXISTS farmer.household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  relationship_to_farmer TEXT,
  sex TEXT CHECK (sex IN ('male', 'female', 'other', 'unknown')),
  date_of_birth DATE,
  phone_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farmer.farmer_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  file_name TEXT,
  mime_type TEXT,
  captured_at TIMESTAMPTZ,
  uploaded_by_user_id UUID REFERENCES iam.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farmer.profile_change_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE CASCADE,
  changed_by_user_id UUID REFERENCES iam.users(id) ON DELETE SET NULL,
  field_name TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farmer_farmers_cooperative_id ON farmer.farmers(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_farmer_farmers_active ON farmer.farmers(is_active);
CREATE INDEX IF NOT EXISTS idx_farmer_household_members_farmer_id ON farmer.household_members(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_photos_farmer_id ON farmer.farmer_photos(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_profile_change_history_farmer_id ON farmer.profile_change_history(farmer_id);
