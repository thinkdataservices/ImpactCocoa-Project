CREATE TABLE IF NOT EXISTS traceability.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE RESTRICT,
  batch_number TEXT NOT NULL UNIQUE,
  season TEXT NOT NULL,
  batch_type TEXT NOT NULL DEFAULT 'primary' CHECK (batch_type IN ('primary', 'secondary', 'blended')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'exported', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS traceability.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE RESTRICT,
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE RESTRICT,
  parcel_id UUID REFERENCES gis.parcels(id) ON DELETE SET NULL,
  purchase_level TEXT NOT NULL CHECK (purchase_level IN ('primary', 'secondary')),
  purchase_date DATE NOT NULL,
  quantity_kg NUMERIC(12,3) NOT NULL,
  quality_grade TEXT,
  price_per_kg NUMERIC(12,2),
  source_submission_uuid TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS traceability.batch_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES traceability.batches(id) ON DELETE CASCADE,
  purchase_id UUID NOT NULL REFERENCES traceability.purchases(id) ON DELETE CASCADE,
  weight_kg NUMERIC(12,3) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (batch_id, purchase_id)
);

CREATE TABLE IF NOT EXISTS traceability.trace_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE RESTRICT,
  batch_id UUID NOT NULL REFERENCES traceability.batches(id) ON DELETE CASCADE,
  purchase_id UUID NOT NULL REFERENCES traceability.purchases(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE RESTRICT,
  parcel_id UUID REFERENCES gis.parcels(id) ON DELETE SET NULL,
  snapshot_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (batch_id, purchase_id, farmer_id, parcel_id)
);

CREATE INDEX IF NOT EXISTS idx_traceability_batches_cooperative_id ON traceability.batches(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_traceability_purchases_farmer_id ON traceability.purchases(farmer_id);
CREATE INDEX IF NOT EXISTS idx_traceability_purchases_cooperative_id ON traceability.purchases(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_traceability_batch_items_batch_id ON traceability.batch_items(batch_id);
CREATE INDEX IF NOT EXISTS idx_traceability_trace_links_batch_id ON traceability.trace_links(batch_id);
CREATE INDEX IF NOT EXISTS idx_traceability_trace_links_farmer_id ON traceability.trace_links(farmer_id);
