# NeoViet360 Data Science Roadmap

## 1. Mục tiêu của dự án

NeoViet360 hiện là ứng dụng quản lý tài chính cá nhân. Mục tiêu của roadmap này là phát triển project thành một portfolio project Data Analyst/Data Scientist có thể trình bày trong CV:

> Phân tích hành vi tài chính cá nhân, theo dõi dòng tiền, dự báo chi tiêu và phát hiện giao dịch bất thường.

Project sau khi hoàn thiện cần thể hiện được:

- PostgreSQL và SQL nâng cao.
- Data modeling và thiết kế schema.
- Data quality và data validation.
- ETL/ELT pipeline.
- Exploratory Data Analysis (EDA).
- Feature engineering.
- Machine Learning.
- Model evaluation.
- REST API và dashboard.
- Deployment.
- Documentation và khả năng giải thích insight cho business.

---

## 2. Trạng thái hiện tại

### Đã có

- Frontend quản lý tài chính.
- Backend Express.
- Prisma ORM.
- Supabase PostgreSQL.
- Vercel deployment.
- Các bảng nghiệp vụ trong `public` schema.
- Seed data ban đầu.

### Các bảng hiện tại

Schema được định nghĩa trong `neoviet360-backend/prisma/schema.prisma`:

- `users`
- `accounts`
- `transactions`
- `budgets`
- `savings_goals`
- `loans`
- `cards`
- `bills`
- `split_bills`
- `notifications`
- `rewards`
- `fx_rates`
- `crypto_prices`
- `chat_history`
- `carbon_tracks`

### Các điểm còn thiếu

- Dữ liệu hiện tại quá ít cho phân tích và Machine Learning.
- Chưa có schema phân tích riêng.
- Chưa có data dictionary.
- Chưa có data quality checks.
- Chưa có ETL pipeline có thể chạy lại.
- Chưa có bộ truy vấn SQL phân tích.
- Chưa có notebook EDA.
- Chưa có mô hình dự báo, phát hiện bất thường hoặc phân khúc người dùng.
- Chưa có model evaluation và tracking.
- Chưa có dashboard Data Science.
- Cần xử lý RLS và quyền truy cập dữ liệu rõ ràng.

---

## 3. Kiến trúc mục tiêu

```text
Frontend
    |
    v
Express API
    |
    v
Prisma
    |
    v
Supabase PostgreSQL - OLTP
    |
    v
ETL/ELT pipeline
    |
    v
Supabase PostgreSQL - analytics schema
    |
    +--> SQL reports
    +--> EDA notebooks
    +--> Feature tables
    +--> ML training
              |
              v
       Saved models and metrics
              |
              v
       Analytics API and dashboard
```

### Phân biệt OLTP và Analytics

- `public`: phục vụ ứng dụng và giao dịch hằng ngày.
- `analytics`: phục vụ truy vấn phân tích, báo cáo và Machine Learning.

Không nên chạy các truy vấn phân tích nặng trực tiếp trên bảng production nếu có thể tách riêng.

---

## 4. Nguyên tắc quan trọng

1. Hoàn thiện database trước khi làm Machine Learning.
2. Luôn có baseline trước khi dùng model phức tạp.
3. Mỗi model phải có metric và cách đánh giá rõ ràng.
4. Không dùng dữ liệu cá nhân thật trong repository.
5. Dữ liệu synthetic phải được ghi rõ trong README.
6. Không chỉ trình bày code; phải giải thích insight và giới hạn.
7. Notebook dùng để khám phá, pipeline dùng để chạy lại.
8. Không lưu secret, password hoặc `DATABASE_URL` vào GitHub.
9. Các thay đổi database phải được tạo bằng migration.
10. Mọi bước quan trọng phải có test hoặc kiểm tra kết quả.

---

# 5. Kế hoạch triển khai chi tiết

## Giai đoạn 1 - Hoàn thiện database OLTP

### Mục tiêu

Đảm bảo dữ liệu ứng dụng có cấu trúc đúng, toàn vẹn và đủ tốt để làm nguồn cho analytics.

### Công việc

- [ ] Kiểm tra toàn bộ model trong `schema.prisma`.
- [ ] Xác định rõ kiểu dữ liệu cho tiền tệ.
- [ ] Đảm bảo timestamp sử dụng timezone nhất quán.
- [ ] Đảm bảo mọi bảng người dùng có `user_id`.
- [ ] Thêm unique constraint cho các trường cần duy nhất.
- [ ] Thêm foreign key cho quan hệ.
- [ ] Thêm index cho:
  - [ ] `user_id`
  - [ ] `transaction_date`
  - [ ] `category`
  - [ ] `account_id`
  - [ ] `created_at`
- [ ] Kiểm tra hành vi `ON DELETE`.
- [ ] Tạo migration mới, không sửa migration đã deploy.
- [ ] Kiểm tra migration trên database staging trước production.

### Bảo mật RLS

Các bảng có dữ liệu người dùng nên bật Row Level Security:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
```

RLS phải đi cùng policy. Không bật RLS một cách mù quáng mà không kiểm tra các truy vấn của backend.

Kiến trúc hiện tại nên giữ:

```text
Frontend -> Backend API -> Prisma -> Supabase
```

Không đưa database secret ra frontend.

### Kết quả cần đạt

- Migration chạy thành công.
- Foreign key và index tồn tại.
- Backend vẫn đọc/ghi được dữ liệu.
- Người dùng không thể đọc dữ liệu của user khác.
- Có tài liệu giải thích quyền truy cập.

---

## Giai đoạn 2 - Tạo dataset đủ lớn và có ý nghĩa

### Mục tiêu

Dữ liệu hiện tại chỉ phù hợp để test app, chưa đủ để phân tích hoặc huấn luyện model. Cần tạo dữ liệu synthetic có pattern thực tế.

### Quy mô đề xuất

- 100-500 users.
- 12-24 tháng dữ liệu.
- 50.000-200.000 transactions.
- 10-20 nhóm danh mục.
- Nhiều loại tài khoản.
- Thu nhập theo tháng.
- Giao dịch định kỳ.
- Giao dịch bất thường.

### Pattern nên mô phỏng

- Nhận lương vào một ngày cố định mỗi tháng.
- Chi tiêu tăng vào cuối tuần.
- Chi tiêu tăng vào ngày lễ hoặc Tết.
- Người dùng có danh mục chi tiêu chính khác nhau.
- Người dùng thường vượt ngân sách.
- Giao dịch lặp lại hằng tháng.
- Một tỷ lệ nhỏ giao dịch có số tiền hoặc thời điểm bất thường.

### Dataset generator

Tạo script:

```text
src/data_generation/generate_users.py
src/data_generation/generate_transactions.py
src/data_generation/generate_all.py
```

Generator cần:

- Có random seed để tái lập kết quả.
- Tách cấu hình khỏi code.
- Có thể chọn số lượng users và transactions.
- Tạo dữ liệu hợp lệ với foreign key.
- Ghi lại metadata của dataset.

### Kết quả cần đạt

- Có dataset đủ lớn.
- Có thể tạo lại dataset bằng một command.
- Không chứa thông tin cá nhân thật.
- Có tài liệu về quy trình tạo dữ liệu.

---

## Giai đoạn 3 - Data dictionary và analytics schema

### Mục tiêu

Tạo lớp dữ liệu được chuẩn hóa cho phân tích.

### Schema đề xuất

```text
analytics.dim_user
analytics.dim_date
analytics.dim_account
analytics.dim_category
analytics.fact_transaction
analytics.fact_daily_balance
analytics.fact_monthly_spending
```

### Dimension tables

#### `dim_user`

- `user_key`
- `user_id`
- `created_date`
- `income_segment`
- `risk_segment`

#### `dim_date`

- `date_key`
- `full_date`
- `year`
- `quarter`
- `month`
- `week`
- `day_of_week`
- `is_weekend`
- `is_holiday`

#### `dim_category`

- `category_key`
- `category_name`
- `category_group`
- `is_income`
- `is_expense`

### Fact tables

#### `fact_transaction`

- `transaction_key`
- `transaction_id`
- `user_key`
- `date_key`
- `account_key`
- `category_key`
- `amount`
- `transaction_type`
- `is_recurring`
- `is_anomaly`

#### `fact_monthly_spending`

- `user_key`
- `month_key`
- `total_income`
- `total_expense`
- `net_cashflow`
- `saving_rate`
- `transaction_count`
- `budget_violation_rate`

### Data dictionary

Tạo file:

```text
docs/data-dictionary.md
```

Mỗi cột cần có:

- Tên cột.
- Kiểu dữ liệu.
- Ý nghĩa.
- Nguồn dữ liệu.
- Có thể NULL hay không.
- Quy tắc kiểm tra.
- Ví dụ.

---

## Giai đoạn 4 - Data quality

### Mục tiêu

Phát hiện dữ liệu sai trước khi dùng cho báo cáo hoặc Machine Learning.

### Kiểm tra bắt buộc

- [ ] `amount` không được NULL.
- [ ] `amount` không được sai dấu.
- [ ] `user_id` phải tồn tại.
- [ ] `account_id` phải tồn tại nếu bắt buộc.
- [ ] Transaction date không được ở tương lai.
- [ ] Không có transaction duplicate.
- [ ] Category phải nằm trong danh sách hợp lệ.
- [ ] Không có user orphan.
- [ ] Không có account orphan.
- [ ] Số dư phải khớp với giao dịch khi có thể kiểm tra.
- [ ] Tỷ lệ NULL nằm dưới ngưỡng cho phép.

### Data quality metrics

- Row count.
- Null rate.
- Duplicate rate.
- Invalid value rate.
- Referential integrity.
- Min/max date.
- Data freshness.

### Cách triển khai

Ban đầu có thể dùng SQL tests:

```text
tests/sql/test_transactions.sql
tests/sql/test_referential_integrity.sql
tests/sql/test_data_freshness.sql
```

Sau đó có thể chuyển sang dbt tests nếu cần.

---

## Giai đoạn 5 - SQL analytics

Tạo thư mục:

```text
analytics/sql/
```

### Bộ truy vấn đề xuất

```text
01_monthly_cashflow.sql
02_category_spending.sql
03_budget_variance.sql
04_saving_rate.sql
05_recurring_transactions.sql
06_user_lifetime_value.sql
07_user_retention.sql
08_anomaly_candidates.sql
09_income_expense_ratio.sql
10_customer_segments.sql
```

### Các câu hỏi cần trả lời

- Tổng thu nhập và chi tiêu mỗi tháng là bao nhiêu?
- Danh mục nào chiếm tỷ trọng lớn nhất?
- Người dùng nào thường vượt ngân sách?
- Tỷ lệ tiết kiệm thay đổi thế nào?
- Có bao nhiêu giao dịch định kỳ?
- Người dùng nào có dòng tiền âm?
- Chi tiêu thay đổi theo ngày trong tuần như thế nào?
- Nhóm người dùng nào có hành vi tài chính giống nhau?
- Những giao dịch nào có khả năng bất thường?

### Chuẩn đầu ra của mỗi phân tích

Mỗi truy vấn cần có:

1. Business question.
2. SQL query.
3. Dataset/output.
4. Visualization.
5. Insight.
6. Limitation.

---

## Giai đoạn 6 - Python EDA

### Notebook đề xuất

```text
notebooks/
├── 01_data_quality.ipynb
├── 02_exploratory_analysis.ipynb
├── 03_monthly_cashflow.ipynb
├── 04_user_behavior.ipynb
├── 05_feature_analysis.ipynb
└── 06_model_evaluation.ipynb
```

### Nội dung EDA

- Phân phối số tiền giao dịch.
- Phân phối theo category.
- Xu hướng chi tiêu theo thời gian.
- Chi tiêu theo ngày trong tuần.
- Chi tiêu theo tháng.
- Tỷ lệ thu nhập/chi tiêu.
- Outlier analysis.
- Missing-value analysis.
- Correlation analysis.
- Cohort hoặc retention analysis.

### Quy tắc notebook

Mỗi notebook phải có cấu trúc:

```text
1. Objective
2. Business questions
3. Data loading
4. Data validation
5. Analysis
6. Visualization
7. Findings
8. Limitations
```

Không chỉ đưa biểu đồ mà không có kết luận.

---

## Giai đoạn 7 - Feature engineering

Tạo module:

```text
src/features/build_features.py
```

### Feature theo user

- Monthly income.
- Monthly expense.
- Saving rate.
- Average transaction amount.
- Transaction frequency.
- Category diversity.
- Budget violation rate.
- Number of recurring transactions.
- Average account balance.

### Feature theo thời gian

- Day of week.
- Month.
- Quarter.
- Is weekend.
- Is holiday.
- Days since last transaction.

### Feature rolling window

- Spending in previous 7 days.
- Spending in previous 30 days.
- Spending in previous 90 days.
- Transaction count in previous 7 days.
- Category spending in previous 30 days.

### Nguyên tắc tránh leakage

Feature dùng để dự báo tại thời điểm `t` không được sử dụng dữ liệu xảy ra sau `t`.

---

## Giai đoạn 8 - Machine Learning

## 8.1. Dự báo chi tiêu

### Bài toán

Dự báo tổng chi tiêu của user trong 7 hoặc 30 ngày tiếp theo.

### Baseline

- Last value.
- Moving average.
- Seasonal naive.

### Model

- Linear Regression.
- Random Forest.
- Gradient Boosting.
- XGBoost hoặc LightGBM nếu cần.

### Metrics

- MAE.
- RMSE.
- MAPE.

### Báo cáo cần có

- Baseline result.
- Model result.
- Feature importance.
- Error analysis.
- Performance theo nhóm user.

## 8.2. Phát hiện giao dịch bất thường

### Model

- Rule-based baseline.
- Isolation Forest.
- Local Outlier Factor.

### Features

- Amount.
- Hour.
- Category.
- User average amount.
- Distance from user mean.
- Transaction frequency.
- Time since previous transaction.

### Đánh giá

- Precision.
- Recall.
- Precision@K.
- False positive analysis.
- Manual review của các anomaly hàng đầu.

## 8.3. Phân khúc người dùng

### Model

- K-Means.
- Hierarchical Clustering.

### Features

- Monthly income.
- Monthly expense.
- Saving rate.
- Transaction frequency.
- Average transaction amount.
- Category diversity.
- Budget violation rate.

### Đánh giá

- Silhouette score.
- Cluster size.
- Cluster stability.
- Business interpretation.

Mỗi cluster phải có tên và giải thích, ví dụ:

- Người tiết kiệm ổn định.
- Người chi tiêu cao cuối tháng.
- Người có dòng tiền không ổn định.

---

## Giai đoạn 9 - Pipeline và model management

### Cấu trúc đề xuất

```text
src/
├── pipeline/
│   ├── extract.py
│   ├── transform.py
│   └── load.py
├── features/
│   └── build_features.py
├── models/
│   ├── train_forecasting.py
│   ├── train_anomaly.py
│   └── train_segmentation.py
└── evaluation/
    └── evaluate_models.py
```

### Pipeline cần đảm bảo

- Có thể chạy lại.
- Có logging.
- Có cấu hình riêng.
- Có random seed.
- Có data validation.
- Không hard-code secret.
- Có version cho dataset và model.

### Metadata model

Mỗi model cần lưu:

- Model name.
- Model version.
- Training timestamp.
- Dataset version.
- Feature columns.
- Metrics.
- Hyperparameters.
- Model file path.

---

## Giai đoạn 10 - Analytics API và dashboard

### API đề xuất

```text
GET /api/analytics/summary
GET /api/analytics/monthly-spending
GET /api/analytics/category-breakdown
GET /api/analytics/cashflow
GET /api/analytics/anomalies
GET /api/analytics/forecast
GET /api/analytics/user-segment
```

### Dashboard cần hiển thị

- Tổng thu nhập.
- Tổng chi tiêu.
- Net cashflow.
- Saving rate.
- Top categories.
- So sánh actual và budget.
- Dự báo chi tiêu.
- Cảnh báo anomaly.
- Nhóm hành vi tài chính.

### Quy tắc triển khai model

Không train model trong mỗi API request.

```text
Training job -> lưu model -> API load model -> trả prediction
```

---

## Giai đoạn 11 - Testing và deployment

### Tests

- [ ] Unit test cho feature engineering.
- [ ] Test data quality.
- [ ] Test SQL transformation.
- [ ] Test API response.
- [ ] Test model input.
- [ ] Test model output.
- [ ] Test empty dataset.
- [ ] Test missing value.

### Deployment

- Supabase: database.
- Vercel: frontend và API hiện tại.
- Streamlit hoặc dashboard web: Data Science dashboard.
- GitHub Actions: chạy quality checks và tests.

### Environment variables

Không commit:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- API keys.

---

## Giai đoạn 12 - Documentation và portfolio

### Các tài liệu cần có

```text
README.md
docs/architecture.md
docs/data-dictionary.md
docs/sql-analysis.md
docs/ml-methodology.md
docs/privacy.md
```

### README phải có

1. Problem statement.
2. Project motivation.
3. Architecture diagram.
4. Dataset description.
5. Data pipeline.
6. SQL analysis screenshots.
7. EDA screenshots.
8. Model metrics.
9. API examples.
10. Demo link.
11. Limitations.
12. How to run locally.

### Cách mô tả trong CV

Ví dụ:

```text
Built an end-to-end personal finance analytics platform using PostgreSQL,
Python, SQL, and scikit-learn; designed an analytics star schema, processed
100K+ synthetic transactions, developed spending forecasting, anomaly
detection, and user segmentation models, and exposed predictions through REST APIs.
```

Chỉ ghi các con số sau khi đã đo và kiểm tra thực tế.

---

# 6. Lộ trình thực hiện theo tuần

## Tuần 1 - Database foundation

- [ ] Audit schema.
- [ ] Chuẩn hóa dữ liệu.
- [ ] Thêm index.
- [ ] Kiểm tra foreign key.
- [ ] Thiết kế RLS.
- [ ] Viết data dictionary bản đầu tiên.

## Tuần 2 - Dataset và analytics schema

- [ ] Viết synthetic data generator.
- [ ] Tạo tối thiểu 50.000 transactions.
- [ ] Tạo `analytics` schema.
- [ ] Tạo dimension tables.
- [ ] Tạo fact tables.
- [ ] Load dữ liệu lần đầu.

## Tuần 3 - Data quality và SQL

- [ ] Viết quality checks.
- [ ] Viết 10 truy vấn SQL.
- [ ] Kiểm tra query performance.
- [ ] Tạo bảng aggregate theo ngày/tháng.

## Tuần 4 - EDA

- [ ] Hoàn thiện notebook data quality.
- [ ] Hoàn thiện notebook EDA.
- [ ] Tạo biểu đồ chi tiêu.
- [ ] Viết business insights.

## Tuần 5 - Machine Learning

- [ ] Làm baseline forecasting.
- [ ] Huấn luyện model forecasting.
- [ ] Làm anomaly detection.
- [ ] Làm user segmentation.
- [ ] Đánh giá và lưu metrics.

## Tuần 6 - Integration

- [ ] Tạo analytics API.
- [ ] Tích hợp prediction vào ứng dụng.
- [ ] Tạo dashboard.
- [ ] Thêm tests.

## Tuần 7 - Deployment và portfolio

- [ ] Hoàn thiện README.
- [ ] Viết architecture documentation.
- [ ] Thêm screenshots.
- [ ] Deploy demo.
- [ ] Kiểm tra lại security.
- [ ] Chuẩn bị phần mô tả CV.

---

# 7. Definition of Done

Project được coi là hoàn thiện khi:

- [ ] Database migration chạy được từ đầu.
- [ ] Có dữ liệu synthetic đủ lớn và tái tạo được.
- [ ] Có analytics schema.
- [ ] Có data dictionary.
- [ ] Có data quality checks.
- [ ] Có ít nhất 10 truy vấn SQL có giải thích.
- [ ] Có EDA notebooks.
- [ ] Có ít nhất 2 bài toán Machine Learning.
- [ ] Có baseline và metrics.
- [ ] Có error analysis.
- [ ] Có API phục vụ analytics.
- [ ] Có dashboard.
- [ ] Có tests.
- [ ] Có README đủ để người khác chạy lại.
- [ ] Không commit secrets.
- [ ] Có phần limitation và privacy.

---

# 8. Thứ tự ưu tiên khi bắt đầu

Không bắt đầu ngay bằng Machine Learning. Thứ tự nên là:

```text
1. Kiểm tra database
2. Tạo dữ liệu đủ lớn
3. Kiểm tra chất lượng dữ liệu
4. Thiết kế analytics schema
5. Viết SQL analytics
6. Làm EDA
7. Feature engineering
8. Machine Learning
9. API và dashboard
10. Documentation và deployment
```

Mỗi giai đoạn chỉ chuyển sang bước tiếp theo sau khi có output kiểm chứng được.
