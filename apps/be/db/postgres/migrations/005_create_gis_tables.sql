CREATE TABLE IF NOT EXISTS gis.geo_import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_format TEXT NOT NULL CHECK (source_format IN ('geojson', 'kml', 'kmz', 'shapefile', 'manual', 'qgis')),
  source_file_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gis.parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES farmer.farmers(id) ON DELETE RESTRICT,
  cooperative_id UUID NOT NULL REFERENCES iam.cooperatives(id) ON DELETE RESTRICT,
  field_id TEXT NOT NULL UNIQUE,
  parcel_name TEXT,
  parcel_status TEXT NOT NULL DEFAULT 'active' CHECK (parcel_status IN ('active', 'inactive', 'archived')),
  crop_type TEXT,
  planting_date DATE,
  tree_count INTEGER,
  calculated_area_ha NUMERIC(12,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gis.parcel_geometries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL UNIQUE REFERENCES gis.parcels(id) ON DELETE CASCADE,
  import_job_id UUID REFERENCES gis.geo_import_jobs(id) ON DELETE SET NULL,
  source_format TEXT,
  captured_at TIMESTAMPTZ,
  geom GEOMETRY(MultiPolygon, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gis.parcel_characteristics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL UNIQUE REFERENCES gis.parcels(id) ON DELETE CASCADE,
  soil_type TEXT,
  irrigation_type TEXT,
  shade_tree_count INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gis.parcel_overlap_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES gis.parcels(id) ON DELETE CASCADE,
  nearby_parcel_id UUID NOT NULL REFERENCES gis.parcels(id) ON DELETE CASCADE,
  distance_meters NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'flagged' CHECK (status IN ('flagged', 'reviewed', 'dismissed')),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (parcel_id, nearby_parcel_id)
);

CREATE TABLE IF NOT EXISTS gis.eudr_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL UNIQUE REFERENCES gis.parcels(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'unknown' CHECK (status IN ('unknown', 'compliant', 'non_compliant', 'needs_review')),
  assessed_at TIMESTAMPTZ,
  assessed_by TEXT,
  baseline_dataset TEXT,
  qgis_job_ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gis_parcels_farmer_id ON gis.parcels(farmer_id);
CREATE INDEX IF NOT EXISTS idx_gis_parcels_cooperative_id ON gis.parcels(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_gis_parcel_geometries_geom ON gis.parcel_geometries USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_gis_overlap_flags_parcel_id ON gis.parcel_overlap_flags(parcel_id);
CREATE INDEX IF NOT EXISTS idx_gis_eudr_status_status ON gis.eudr_status(status);
