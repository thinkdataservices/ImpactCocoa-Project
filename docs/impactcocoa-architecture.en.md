# ImpactCocoa Architecture Proposal (English)

## 1. Purpose

This document captures the agreed target architecture for the ImpactCocoa Data Management Platform based on the SRS and the final architectural decision:

- use microservices logically separated by domain
- use one shared PostgreSQL cluster with PostGIS
- separate ownership by schema/table, not by physical database
- keep strict service boundaries at application level

This is a pragmatic microservices architecture designed for the 16-week delivery window in the SRS.

## 2. Final Architecture Decision

### Chosen approach

ImpactCocoa will be implemented as **logical microservices with a shared database cluster**.

Each service:

- owns its own schema and tables
- exposes its own API and business rules
- can read from shared reporting projections when needed
- must not write into tables owned by another service

### Why this approach

This model is the best balance between:

- the user's request for microservices
- the SRS delivery timeline of 16 weeks
- the need to support GIS, traceability, Kobo sync, audit, and reporting
- lower operational complexity than full database-per-service microservices

### Explicit non-goals

The first version does **not** aim for:

- pure database-per-service isolation
- distributed transactions across services
- full event-sourced architecture
- full EUDR automation

## 3. Architecture Principles

The solution must follow these principles:

1. **Domain ownership**: each service owns a clear business capability.
2. **Shared DB with discipline**: the database is shared physically, but ownership is still per service.
3. **API-enforced segregation**: district/cooperative access is enforced at API level, never only in the UI.
4. **PostGIS-first GIS logic**: polygon validation and area calculation live in the GIS service and database layer.
5. **Async where useful**: reporting, sync, import, and audit can be event-driven or job-driven.
6. **Offline-first intake**: Kobo is the field data capture channel; the platform database remains the system of record.
7. **Traceability-first modeling**: purchases, batches, parcels, and farmers must link cleanly for EUDR reporting.

## 4. System Scope Covered by Architecture

The architecture supports these SRS modules:

- authentication and RBAC
- farmer profiling
- farm inspections and compliance follow-up
- farm mapping and geospatial validation
- EUDR semi-automated status handling
- traceability from purchase to parcel
- farmer training and coaching
- reporting and analytics
- administration and audit logging
- KoboToolbox sync and FarmForce migration

## 5. C4 - System Context

### Primary users

- Field Officers
- IMS Managers
- Project Leader
- System Administrator
- Whittakers
- Cooperative Chair

### External systems

- KoboToolbox Premium / KoboCollect Android
- QGIS desktop workflow for semi-automated deforestation assessment
- FarmForce legacy system for historical migration
- external REST consumers/providers for future integrations

### System of interest

ImpactCocoa Data Management Platform is the central system for farmer, parcel, compliance, traceability, and reporting data.

## 6. C4 - Container View

### 6.1 Web App

**Technology**: React.js

Responsibilities:

- responsive web UI for desktop, tablet, and mobile
- dashboards, reports, and administration screens
- map viewing using Leaflet.js
- secure interaction with backend APIs through the gateway

### 6.2 API Gateway

**Technology**: Node.js + Express

Responsibilities:

- single entry point for frontend and approved third parties
- JWT verification and request context propagation
- request routing to internal services
- CORS, throttling, and basic request observability

### 6.3 Identity Service

**Technology**: Node.js + Express

Responsibilities:

- login and token issuance
- forgot/reset password
- role and permission management
- cooperative/district assignment
- session and access policy checks

### 6.4 Farmer Service

**Technology**: Node.js + Express

Responsibilities:

- farmer master profile
- household members
- photograph metadata
- farmer code generation
- farmer profile audit trail

### 6.5 Field Operations Service

**Technology**: Node.js + Express

Responsibilities:

- internal inspections
- findings and compliance scoring inputs
- non-compliance follow-up actions
- training modules and sessions
- coaching visits and farm development plans

### 6.6 GIS and EUDR Service

**Technology**: Node.js + Express with PostgreSQL/PostGIS

Responsibilities:

- parcel registration and field ID generation
- polygon storage and validation
- Ghana bounding box validation
- proximity flagging within 10 meters
- area calculation
- geospatial import/export
- import and storage of parcel-level EUDR status from QGIS outputs

### 6.7 Traceability Service

**Technology**: Node.js + Express

Responsibilities:

- primary and secondary evacuation purchases
- batch numbering
- purchase-to-batch linking
- traceability chain generation across farmer, parcel, and batch

### 6.8 Reporting Service

**Technology**: Node.js + Express

Responsibilities:

- report generation and filtering
- export to PDF, Excel, and CSV
- dashboard data aggregation
- report generation audit log
- read-optimized reporting views and projections

### 6.9 Integration Service

**Technology**: Python REST/worker service

Responsibilities:

- incremental KoboToolbox sync with pagination and retry
- raw submission ingestion
- transformation and mapping into domain APIs
- attachment/photo ingestion
- FarmForce migration ETL and reconciliation support

### 6.10 Audit Module or Audit Service

Responsibilities:

- immutable audit trail for business and administrative activity
- support compliance evidence
- central record of data changes and report execution activity

### 6.11 Shared Data Layer

**Technology**: PostgreSQL with PostGIS

Responsibilities:

- central persistence cluster
- schema-level ownership by service
- GIS geometry storage
- transaction integrity within a service boundary

### 6.12 Object Storage

Responsibilities:

- farmer photos
- generated report files
- import/export artifacts
- migration and sync attachments

## 7. Shared Database Ownership Model

The platform will use one PostgreSQL cluster, but ownership is separated by schema.

### Proposed schemas

- `iam`
- `farmer`
- `field_ops`
- `gis`
- `traceability`
- `reporting`
- `integration`
- `audit`

### Ownership rule

Each service may:

- read and write its own tables
- expose data to other services through API or controlled projections

Each service may not:

- write directly into another service's schema
- embed business logic by querying across all schemas freely
- bypass authorization by reading another domain's raw tables in the request path

### Controlled exceptions

The following are acceptable with discipline:

- read-only reporting views for analytics
- limited cross-schema foreign keys for stable identities such as `user_id` or `farmer_id`
- migration scripts administered centrally

## 8. Proposed Schema Ownership

### `iam`

- `users`
- `roles`
- `permissions`
- `role_permissions`
- `user_roles`
- `user_cooperative_assignments`
- `password_reset_tokens`
- `sessions`

### `farmer`

- `farmers`
- `household_members`
- `farmer_photos`
- `profile_change_history`

### `field_ops`

- `inspections`
- `inspection_findings`
- `follow_up_actions`
- `training_modules`
- `training_sessions`
- `training_attendance`
- `coaching_visits`
- `farm_development_plans`
- `coaching_reports`

### `gis`

- `parcels`
- `parcel_geometries`
- `parcel_characteristics`
- `parcel_overlap_flags`
- `eudr_status`
- `geo_import_jobs`

### `traceability`

- `purchases`
- `batches`
- `batch_items`
- `trace_links`

### `reporting`

- `report_runs`
- `report_files`
- `dashboard_snapshots`
- `traceability_report_cache`
- `inspection_report_cache`

### `integration`

- `kobo_submissions_raw`
- `sync_cursors`
- `sync_jobs`
- `sync_errors`
- `migration_jobs`
- `reconciliation_results`

### `audit`

- `audit_logs`
- `entity_changes`
- `report_audit_logs`

## 9. Key Business Flows

### 9.1 Farmer onboarding

1. Kobo form submits farmer intake data.
2. Integration Service fetches submissions incrementally.
3. Data is validated and mapped.
4. Farmer Service creates or updates farmer records.
5. GIS Service stores parcel information if included.
6. Audit entry is written.

### 9.2 Inspection and follow-up

1. Internal inspection form is submitted.
2. Integration Service maps the payload to Field Operations Service.
3. Inspection, findings, and follow-up actions are created.
4. Compliance score and certification status inputs are updated.
5. Reporting projections are refreshed.

### 9.3 Farm mapping and EUDR

1. Parcel geometry is captured or imported.
2. GIS Service validates Ghana bounds and duplicate proximity.
3. PostGIS calculates area.
4. QGIS performs semi-automated deforestation analysis externally.
5. EUDR status result is imported into GIS Service.
6. Reporting and traceability consume the resulting parcel status.

### 9.4 Traceability

1. Purchase forms sync through Integration Service.
2. Traceability Service records purchases and assigns batch numbers.
3. Trace chain links are created between batch, purchase, parcel, and farmer.
4. Reporting Service generates EUDR traceability outputs.

### 9.5 Reporting

1. User requests a report through the web app.
2. Gateway forwards the request with user scope.
3. Reporting Service validates access.
4. Reporting Service queries read-optimized data.
5. File export is generated and stored.
6. Audit log records report execution.

## 10. Authorization and Data Segregation

This is a non-negotiable architectural rule from the SRS.

### Required enforcement

Every read and write API must validate:

- authenticated user identity
- role permission
- cooperative or district assignment
- access to the target entity

### Mandatory model rule

All business entities must carry one or both of these fields where relevant:

- `cooperative_id`
- `district_id`

### Access summary

- Field Officers: own district only
- IMS Managers: own district only
- Cooperative Chair: own district only, mostly view-only
- Project Leader: all districts
- System Administrator: all districts, administrative functions
- Whittakers: all districts, view-only

### Important note

Frontend filtering is helpful for usability, but it is never sufficient for security.

## 11. Security Design

The solution must satisfy these technical controls:

- TLS 1.3 or higher in transit
- AES-256 or cloud-equivalent encryption at rest
- bcrypt password hashing with minimum cost factor 12
- session expiration after 30 minutes of inactivity
- full audit logging for critical operations

### JWT claims

Recommended token claims:

- `sub`
- `email`
- `role`
- `cooperative_ids`
- `district_scope`
- `permissions`

### Audit-required actions

- farmer profile changes
- inspection updates
- follow-up action changes
- training and coaching updates
- parcel and EUDR status changes
- purchase and batch changes
- report generation
- admin actions
- sync and migration actions

## 12. GIS and PostGIS Design Rules

### Geometry storage

- store polygons as `geometry(MultiPolygon, 4326)` where possible
- keep raw import metadata for traceability

### Validation rules

- reject parcels outside Ghana bounding box defined in the SRS
- flag parcels within 10 meters of an existing parcel
- calculate area in the GIS service/database layer

### Map rendering

- Leaflet.js is the web visualization layer
- business validation must not depend on frontend map behavior

## 13. Reporting and Analytics Strategy

Reporting must not depend on heavy runtime joins across all services for every request.

### Recommended pattern

- use reporting projections or materialized views
- precompute common dashboard metrics
- support async export jobs for large report files

### Priority reports

- Primary Evacuation report
- Secondary Evacuation report
- Traceability report
- Internal Inspection and Follow-up report
- Training and Coaching report
- GRM report

## 14. Integration Strategy

### KoboToolbox

The Integration Service must support:

- incremental cursor-based sync
- pagination
- retry and error recovery
- idempotent submission handling
- offline submission reconciliation
- attachment download and mapping

### FarmForce migration

Migration should follow this sequence:

1. extract historical data
2. transform and normalize
3. load into target schemas through controlled processes
4. generate reconciliation report
5. obtain sign-off before production cutover

## 15. Infrastructure View

### Runtime components

- React frontend
- Node.js services
- Python integration service
- PostgreSQL/PostGIS managed instance
- object storage
- monitoring and alerting

### Environments

- local
- staging
- production

### Platform expectations

- automated backups daily
- restore procedure documented
- uptime monitoring enabled
- centralized logs
- metrics and alerting

## 16. Delivery Guidance by Phase

### Phase 1 - Foundation

- create DB schemas and service ownership rules
- establish gateway and identity service
- bootstrap React app structure and internal API contracts
- provision staging infrastructure

### Phase 2 - Kobo and GIS foundation

- publish and validate all Kobo forms
- build Integration Service sync flow
- implement parcel registration and geospatial validation
- deliver initial Leaflet map view

### Phase 3 - Core business services

- Farmer Service
- Field Operations Service
- Traceability Service
- core audit capability

### Phase 4 - Reporting and hardening

- Reporting Service
- export generation
- load tests
- security checks
- UAT support

### Phase 5 - Migration, deployment, and handover

- FarmForce migration
- production deployment
- documentation and training
- hypercare support

## 17. Risks and Mitigations

### Risk 1 - Shared DB becomes a distributed monolith

Mitigation:

- enforce schema ownership
- ban cross-service writes
- review SQL access patterns in code review

### Risk 2 - Reporting becomes too slow

Mitigation:

- add reporting projections early
- index traceability and parcel tables carefully
- make large exports asynchronous

### Risk 3 - Kobo payloads do not align with domain model

Mitigation:

- use staging/raw submission tables
- validate and map before domain writes
- version transformation logic

### Risk 4 - Data segregation leaks between cooperatives

Mitigation:

- enforce API-level scope validation everywhere
- include `cooperative_id` in core entities
- test authorization deeply

### Risk 5 - GIS validation logic drifts

Mitigation:

- centralize geo rules in GIS service
- use PostGIS functions consistently
- treat Leaflet as display only

## 18. Final Recommendation

The recommended target architecture for ImpactCocoa is:

- logical microservices
- one shared PostgreSQL/PostGIS cluster
- schema-per-service ownership
- Node.js + Express for core APIs
- Python Integration Service for Kobo and migration
- React frontend through an API Gateway
- reporting based on read-optimized projections

This approach keeps the architecture aligned with the SRS, supports the required compliance and GIS complexity, and remains realistic for the agreed delivery timeline.
