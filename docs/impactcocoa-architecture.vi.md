# Đề xuất kiến trúc ImpactCocoa (Tiếng Việt)

## 1. Mục đích

Tài liệu này ghi lại kiến trúc mục tiêu đã được chốt cho ImpactCocoa Data Management Platform, dựa trên SRS và quyết định cuối cùng:

- dùng microservices theo domain logic
- dùng chung 1 PostgreSQL cluster có PostGIS
- tách quyền sở hữu theo schema/table, không tách physical database
- giữ boundary service bằng logic ứng dụng

Đây là mô hình microservices thực dụng, phù hợp với timeline 16 tuần trong SRS.

## 2. Quyết định kiến trúc đã chốt

### Hướng đã chọn

ImpactCocoa sẽ được xây dựng theo mô hình **logical microservices dùng chung database cluster**.

Mỗi service:

- sở hữu schema và table riêng
- có API và business rule riêng
- có thể đọc dữ liệu thông qua projection/reporting có kiểm soát
- không được ghi trực tiếp vào table của service khác

### Vì sao chọn hướng này

Mô hình này cân bằng tốt nhất giữa:

- yêu cầu microservices của người dùng
- timeline 16 tuần trong SRS
- độ phức tạp của GIS, traceability, Kobo sync, audit, reporting
- vận hành đơn giản hơn so với pure microservices tách database per service

### Phạm vi không nhắm tới ở version đầu

Version đầu **không** nhắm tới:

- tách database per service hoàn toàn
- distributed transaction giữa các service
- event sourcing hoàn chỉnh
- full automation EUDR

## 3. Nguyên tắc kiến trúc

Giải pháp phải tuân theo các nguyên tắc sau:

1. **Sở hữu theo domain**: mỗi service phụ trách một business capability rõ ràng.
2. **Dùng chung DB nhưng có kỷ luật**: dùng chung database về mặt vật lý, nhưng ownership vẫn tách theo service.
3. **Phân quyền ở API**: district/cooperative phải được enforce ở API layer, không chỉ ở UI.
4. **PostGIS-first cho GIS**: validate polygon và tính area nằm ở GIS service và DB layer.
5. **Bất đồng bộ khi cần**: reporting, sync, import, audit có thể chạy theo job hoặc event.
6. **Offline-first cho nhập liệu**: Kobo là kênh thu thập field data; database của platform mới là system of record.
7. **Model traceability ngay từ đầu**: purchase, batch, parcel, farmer phải liên kết sạch để báo cáo EUDR.

## 4. Phạm vi hệ thống được kiến trúc bao phủ

Kiến trúc này hỗ trợ các module trong SRS:

- authentication và RBAC
- farmer profiling
- farm inspections và follow-up compliance
- farm mapping và geospatial validation
- xử lý EUDR semi-automated
- traceability từ mua hàng đến parcel
- farmer training và coaching
- reporting và analytics
- administration và audit logging
- KoboToolbox sync và FarmForce migration

## 5. C4 - System Context

### Nhóm người dùng chính

- Field Officers
- IMS Managers
- Project Leader
- System Administrator
- Whittakers
- Cooperative Chair

### Hệ thống ngoài

- KoboToolbox Premium / KoboCollect Android
- QGIS desktop workflow cho đánh giá deforestation semi-automated
- FarmForce legacy system để migrate dữ liệu lịch sử
- các hệ thống REST ngoài cho tích hợp trong tương lai

### Hệ thống trung tâm

ImpactCocoa Data Management Platform là hệ thống trung tâm quản lý dữ liệu farmer, parcel, compliance, traceability và reporting.

## 6. C4 - Container View

### 6.1 Web App

**Công nghệ**: React.js

Trách nhiệm:

- web UI responsive cho desktop, tablet, mobile
- dashboard, report, màn hình admin
- map viewer dùng Leaflet.js
- giao tiếp backend thông qua gateway

### 6.2 API Gateway

**Công nghệ**: Node.js + Express

Trách nhiệm:

- điểm vào duy nhất cho frontend và đối tác được phép
- verify JWT và đẩy user context xuống downstream
- route request tới các service nội bộ
- CORS, throttling, observability cơ bản

### 6.3 Identity Service

**Công nghệ**: Node.js + Express

Trách nhiệm:

- login và cấp token
- forgot/reset password
- quản lý role và permission
- gán cooperative/district cho user
- kiểm tra session và access policy

### 6.4 Farmer Service

**Công nghệ**: Node.js + Express

Trách nhiệm:

- thông tin farmer master
- household members
- metadata ảnh farmer
- sinh farmer code
- audit trail cho profile thay đổi

### 6.5 Field Operations Service

**Công nghệ**: Node.js + Express

Trách nhiệm:

- internal inspections
- findings và input cho compliance scoring
- follow-up actions cho non-compliance
- training modules và sessions
- coaching visits và farm development plans

### 6.6 GIS và EUDR Service

**Công nghệ**: Node.js + Express với PostgreSQL/PostGIS

Trách nhiệm:

- đăng ký parcel và tạo field ID
- lưu polygon và validate hình học
- validate bounding box của Ghana
- flag parcel trong phạm vi 10m
- tính diện tích
- import/export geospatial data
- import và lưu parcel-level EUDR status từ output của QGIS

### 6.7 Traceability Service

**Công nghệ**: Node.js + Express

Trách nhiệm:

- purchase ở primary và secondary evacuation
- batch numbering
- liên kết purchase vào batch
- tạo traceability chain giữa batch, purchase, parcel, farmer

### 6.8 Reporting Service

**Công nghệ**: Node.js + Express

Trách nhiệm:

- sinh report và filter
- export PDF, Excel, CSV
- tổng hợp dữ liệu dashboard
- log audit cho việc generate report
- read model/projection tối ưu cho reporting

### 6.9 Integration Service

**Công nghệ**: Python REST/worker service

Trách nhiệm:

- incremental KoboToolbox sync có pagination và retry
- ingest raw submission
- transform và map vào domain APIs
- ingest attachment/photo
- ETL migrate FarmForce và hỗ trợ reconciliation

### 6.10 Audit Module hoặc Audit Service

Trách nhiệm:

- audit trail bất biến cho business và admin activity
- hỗ trợ bằng chứng compliance
- lưu vết thay đổi dữ liệu và report execution

### 6.11 Shared Data Layer

**Công nghệ**: PostgreSQL với PostGIS

Trách nhiệm:

- central persistence cluster
- ownership theo schema của từng service
- lưu dữ liệu geometry cho GIS
- đảm bảo transaction trong boundary của từng service

### 6.12 Object Storage

Trách nhiệm:

- ảnh farmer
- file report đã generate
- import/export artifacts
- attachment cho migration và sync

## 7. Mô hình sở hữu Shared Database

Nền tảng sẽ dùng 1 PostgreSQL cluster, nhưng ownership tách theo schema.

### Các schema đề xuất

- `iam`
- `farmer`
- `field_ops`
- `gis`
- `traceability`
- `reporting`
- `integration`
- `audit`

### Rule ownership

Mỗi service được:

- đọc và ghi trên table của chính nó
- expose dữ liệu cho service khác qua API hoặc projection có kiểm soát

Mỗi service không được:

- ghi trực tiếp vào schema của service khác
- nhồi business logic bằng cách query xuyên qua tất cả schema một cách tự do
- bypass authorization bằng cách đọc raw table của domain khác trong request path

### Ngoại lệ có kiểm soát

Có thể chấp nhận nếu giữ kỷ luật:

- reporting views chỉ đọc cho analytics
- foreign key xuyên schema ở mức hạn chế cho identity ổn định như `user_id` hoặc `farmer_id`
- migration scripts được quản lý tập trung

## 8. Đề xuất ownership theo schema

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

## 9. Các luồng nghiệp vụ chính

### 9.1 Farmer onboarding

1. Kobo form gửi dữ liệu farmer intake.
2. Integration Service lấy submissions theo kiểu incremental.
3. Dữ liệu được validate và map.
4. Farmer Service tạo hoặc cập nhật farmer record.
5. GIS Service lưu parcel nếu có dữ liệu liên quan.
6. Ghi audit entry.

### 9.2 Inspection và follow-up

1. Internal inspection form được submit.
2. Integration Service map payload vào Field Operations Service.
3. Tạo inspection, findings và follow-up actions.
4. Cập nhật input cho compliance score và certification status.
5. Làm mới reporting projection.

### 9.3 Farm mapping và EUDR

1. Geometry của parcel được capture hoặc import.
2. GIS Service validate Ghana bounds và duplicate proximity.
3. PostGIS tính area.
4. QGIS thực hiện deforestation analysis bên ngoài hệ thống.
5. Kết quả EUDR status được import vào GIS Service.
6. Reporting và Traceability đọc trạng thái parcel này.

### 9.4 Traceability

1. Purchase forms sync qua Integration Service.
2. Traceability Service ghi purchase và tạo batch numbers.
3. Tạo trace chain giữa batch, purchase, parcel và farmer.
4. Reporting Service sinh EUDR traceability outputs.

### 9.5 Reporting

1. User yêu cầu report từ web app.
2. Gateway forward request kèm user scope.
3. Reporting Service validate quyền truy cập.
4. Reporting Service query dữ liệu đã tối ưu cho reporting.
5. Tạo file export và lưu object storage.
6. Audit log ghi lại hành động generate report.

## 10. Authorization và Data Segregation

Đây là rule kiến trúc bắt buộc theo SRS.

### Bắt buộc enforce

Mọi read và write API phải validate:

- danh tính user đã được xác thực
- role permission
- cooperative hoặc district assignment
- quyền trên entity đích

### Rule model bắt buộc

Tất cả entity nghiệp vụ phù hợp phải mang một hoặc cả hai trường sau:

- `cooperative_id`
- `district_id`

### Tổng hợp quyền truy cập

- Field Officers: chỉ district của mình
- IMS Managers: chỉ district của mình
- Cooperative Chair: chỉ district của mình, chủ yếu view-only
- Project Leader: tất cả district
- System Administrator: tất cả district, chức năng hành chính
- Whittakers: tất cả district, view-only

### Lưu ý quan trọng

Filter trên frontend chỉ giúp UX, không bao giờ đủ cho security.

## 11. Thiết kế bảo mật

Hệ thống phải đáp ứng các control kỹ thuật sau:

- TLS 1.3 trở lên khi truyền
- AES-256 hoặc cloud-equivalent encryption at rest
- hash password bằng bcrypt với cost factor tối thiểu 12
- session timeout sau 30 phút không hoạt động
- audit log đầy đủ cho các thao tác quan trọng

### JWT claims đề xuất

- `sub`
- `email`
- `role`
- `cooperative_ids`
- `district_scope`
- `permissions`

### Các hành động bắt buộc audit

- thay đổi farmer profile
- cập nhật inspection
- thay đổi follow-up action
- cập nhật training và coaching
- thay đổi parcel và EUDR status
- thay đổi purchase và batch
- generate report
- admin actions
- sync và migration actions

## 12. Rule thiết kế GIS và PostGIS

### Lưu geometry

- nên lưu polygon dưới dạng `geometry(MultiPolygon, 4326)` khi có thể
- giữ metadata của raw import để phục vụ traceability

### Validation rules

- reject parcel nằm ngoài Ghana bounding box trong SRS
- flag parcel nằm trong 10m so với parcel đã tồn tại
- tính area ở GIS service/database layer

### Map rendering

- Leaflet.js chỉ là lớp hiển thị trên web
- business validation không được phụ thuộc vào frontend map

## 13. Chiến lược Reporting và Analytics

Reporting không nên phụ thuộc vào join nặng runtime qua tất cả services cho mỗi request.

### Pattern đề xuất

- dùng reporting projections hoặc materialized views
- precompute các dashboard metrics phổ biến
- hỗ trợ async export jobs cho report file lớn

### Các report ưu tiên

- Primary Evacuation report
- Secondary Evacuation report
- Traceability report
- Internal Inspection and Follow-up report
- Training and Coaching report
- GRM report

## 14. Chiến lược tích hợp

### KoboToolbox

Integration Service phải hỗ trợ:

- incremental sync theo cursor
- pagination
- retry và error recovery
- idempotent submission handling
- đối soát offline submissions
- download và map attachment

### FarmForce migration

Migration nên theo trình tự:

1. extract dữ liệu lịch sử
2. transform và normalize
3. load vào target schema bằng process có kiểm soát
4. tạo reconciliation report
5. sign-off trước khi cutover production

## 15. Infrastructure View

### Runtime components

- React frontend
- Node.js services
- Python integration service
- PostgreSQL/PostGIS managed instance
- object storage
- monitoring và alerting

### Environments

- local
- staging
- production

### Kỳ vọng vận hành

- backup tự động hằng ngày
- có tài liệu restore procedure
- bật uptime monitoring
- centralized logs
- metrics và alerting

## 16. Hướng delivery theo phase

### Phase 1 - Nền tảng

- tạo DB schemas và rule ownership
- dựng gateway và identity service
- bootstrap React app structure và internal API contracts
- provision staging infrastructure

### Phase 2 - Kobo và GIS foundation

- publish và validate tất cả Kobo forms
- build luồng sync của Integration Service
- implement parcel registration và geospatial validation
- deliver bản đầu Leaflet map view

### Phase 3 - Core business services

- Farmer Service
- Field Operations Service
- Traceability Service
- audit capability cơ bản

### Phase 4 - Reporting và hardening

- Reporting Service
- export generation
- load tests
- security checks
- UAT support

### Phase 5 - Migration, deployment, handover

- FarmForce migration
- production deployment
- tài liệu và training
- hypercare support

## 17. Rủi ro và cách giảm thiểu

### Rủi ro 1 - Shared DB biến thành distributed monolith

Cách giảm thiểu:

- enforce schema ownership
- cấm cross-service writes
- review SQL access patterns trong code review

### Rủi ro 2 - Reporting quá chậm

Cách giảm thiểu:

- thêm reporting projections sớm
- đánh index kỹ cho traceability và parcel tables
- cho export lớn chạy async

### Rủi ro 3 - Payload Kobo lệch domain model

Cách giảm thiểu:

- dùng staging/raw submission tables
- validate và map trước khi ghi vào domain
- version hóa logic transform

### Rủi ro 4 - Lộ rò data segregation giữa các cooperative

Cách giảm thiểu:

- enforce scope validation ở API mọi nơi
- đưa `cooperative_id` vào entity cốt lõi
- test authorization kỹ

### Rủi ro 5 - GIS validation logic bị lệch

Cách giảm thiểu:

- tập trung geo rules trong GIS service
- dùng PostGIS functions nhất quán
- xem Leaflet chỉ là display layer

## 18. Khuyến nghị cuối cùng

Kiến trúc mục tiêu được khuyến nghị cho ImpactCocoa là:

- logical microservices
- 1 shared PostgreSQL/PostGIS cluster
- schema-per-service ownership
- Node.js + Express cho core APIs
- Python Integration Service cho Kobo và migration
- React frontend đi qua API Gateway
- reporting dựa trên projection/read model đã tối ưu

Hướng này giữ kiến trúc phù hợp với SRS, đáp ứng độ phức tạp về compliance và GIS, đồng thời vẫn thực tế với timeline delivery đã chốt.
