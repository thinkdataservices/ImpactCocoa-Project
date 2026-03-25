# ImpactCocoa ERD Draft | Bản nháp ERD ImpactCocoa

## 1. Purpose / Mục đích

This document provides the first Entity Relationship Diagram draft for the agreed ImpactCocoa architecture:
- logical microservices
- shared PostgreSQL/PostGIS cluster
- schema-per-service ownership

This ERD is intentionally focused on the core platform entities needed to start migrations, APIs, and service contracts. It is not yet a full production schema.

> **[VN]** Tài liệu này cung cấp bản nháp Biểu đồ Thực thể Liên kết (ERD) đầu tiên cho kiến trúc ImpactCocoa đã được thống nhất:
> - các microservices logic
> - cụm PostgreSQL/PostGIS dùng chung
> - quyền sở hữu theo mô hình schema-per-service (mỗi service một schema)
> 
> ERD này chủ ý tập trung vào các thực thể nền tảng cốt lõi cần thiết để bắt đầu tạo migration, API và các service contract. Đây chưa phải là schema hoàn chỉnh cho môi trường production.

## 2. Design Rules / Nguyên tắc thiết kế

- each domain owns its schema
- cross-schema foreign keys are limited to stable identity references
- all core business records carry cooperative scope directly or through a stable parent
- GIS geometry lives in the `gis` schema with PostGIS types
- reporting tables are read-oriented and may denormalize data
- audit tables are append-only in spirit even if the draft does not yet enforce immutable triggers

> **[VN]**
> - mỗi domain sở hữu schema riêng của nó
> - khóa ngoại (foreign keys) chéo giữa các schema được giới hạn ở các tham chiếu định danh (identity) mang tính ổn định
> - tất cả các bản ghi nghiệp vụ cốt lõi đều mang phạm vi hợp tác xã (cooperative scope) một cách trực tiếp hoặc thông qua một parent ổn định
> - dữ liệu hình học GIS nằm trong schema `gis` với các kiểu dữ liệu của PostGIS
> - các bảng báo cáo (reporting) được định hướng để đọc (read-oriented) và có thể phi chuẩn hóa dữ liệu (denormalize data)
> - các bảng kiểm toán (audit) mang tinh thần chỉ-thêm-mới (append-only) ngay cả khi bản nháp chưa áp dụng các trigger bất biến (immutable)

## 3. Schema Overview / Tổng quan lược đồ

*(Note: You only need one table for both languages. We can translate the "Purpose" column.)*

| Schema | Purpose / Mục đích | Core Tables / Các bảng cốt lõi |
|---|---|---|
| `iam` | identity, roles, cooperative assignment <br> *(định danh, phân quyền, gán hợp tác xã)* | `cooperatives`, `users`, `roles`, `permissions`, `user_cooperative_assignments` |
| `farmer` | farmer master data <br> *(dữ liệu gốc của nông dân)* | `farmers`, `household_members`, `farmer_photos`, `profile_change_history` |
| `field_ops` | inspections, follow-up, training, coaching <br> *(thanh tra, theo dõi, đào tạo, huấn luyện)* | `inspections`, `inspection_findings`, `follow_up_actions`, `training_sessions`, `coaching_visits` |
| `gis` | parcels, geometries, EUDR status <br> *(thửa đất, dữ liệu hình học, trạng thái EUDR)* | `parcels`, `parcel_geometries`, `eudr_status`, `geo_import_jobs` |
| `traceability`| purchases, batches, chain links <br> *(thu mua, lô hàng, liên kết chuỗi)* | `purchases`, `batches`, `batch_items`, `trace_links` |
| `reporting` | report execution and read models <br> *(thực thi báo cáo và mô hình đọc)* | `report_runs`, `report_files`, `dashboard_snapshots` |
| `integration` | Kobo sync and migration jobs <br> *(đồng bộ Kobo và các tiến trình chuyển đổi)* | `kobo_submissions_raw`, `sync_jobs`, `migration_jobs` |
| `audit` | compliance trail <br> *(dấu vết tuân thủ)* | `audit_logs`, `entity_changes`, `report_audit_logs` |

## 4. Core ERD / ERD Cốt lõi

*(Insert your Mermaid code block here. You do not need to translate the code block itself.)*