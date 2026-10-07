# BÀI KIỂM TRA GIỮA KỲ
## MÔN ĐIỆN TOÁN ĐÁM MÂY

Sinh viên: Nguyễn Thành Thịnh  
MSSV: 23IT262

Database:  
`DB_23IT262`

Prefix:  
`262`

VAT:  
`(2 + 4)% = 6%`

## 1. Giới thiệu

Đây là project Node.js/Express cho đề tài **Web Quản lý Sách**. Ứng dụng sử dụng MongoDB Atlas, Mongoose, express-handlebars, express-session, connect-mongo và dotenv.

Thông tin cá nhân hóa được khai báo một lần trong `constants/student.js`. Giao diện, footer, route `/verify`, prefix sản phẩm, VAT và tên database đều lấy dữ liệu động từ file này.

## 2. Cây thư mục

```text
MidTerm/
├── config/database.js
├── constants/student.js
├── models/
│   ├── BookRead.js
│   ├── BookWrite.js
│   └── bookSchema.js
├── routes/bookRoutes.js
├── utils/book.js
├── views/
│   ├── home.handlebars
│   ├── verify.handlebars
│   └── layouts/main.handlebars
├── public/css/style.css
├── test/
│   ├── book.test.js
│   └── student.test.js
├── app.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## 3. Cài đặt và chạy

Yêu cầu Node.js 18 trở lên.

```bash
npm install
copy .env.example .env
npm test
npm start
```

Trên macOS/Linux, lệnh sao chép là:

```bash
cp .env.example .env
```

Mở:

- `http://localhost:3000/`
- `http://localhost:3000/verify`

## 4. MongoDB Atlas

1. Tạo một project và cluster trên MongoDB Atlas.
2. Trong Database Access, tạo user `read_23IT262` với quyền `read` trên database `DB_23IT262`.
3. Tạo user `write_23IT262` với quyền `readWrite` trên database `DB_23IT262`.
4. Trong Network Access, thêm IP đang dùng để chạy ứng dụng. Khi deploy Render, thêm IP phù hợp theo chính sách của Atlas.
5. Lấy connection string và điền vào `.env`.

Ví dụ placeholder:

```env
MONGO_READ_URI=mongodb+srv://<read_23IT262_username>:<read_23IT262_password>@<cluster-url>/?retryWrites=true&w=majority
MONGO_WRITE_URI=mongodb+srv://<write_23IT262_username>:<write_23IT262_password>@<cluster-url>/?retryWrites=true&w=majority
MONGO_SESSION_URI=mongodb+srv://<write_23IT262_username>:<write_23IT262_password>@<cluster-url>/?retryWrites=true&w=majority
```

`MONGO_SESSION_URI` phải dùng user có quyền ghi vì `connect-mongo` cần tạo/cập nhật collection `sessions`. Để tách quyền chặt hơn, có thể tạo thêm user session riêng với quyền `readWrite` và chỉ dùng URI đó cho session.

Ứng dụng dùng hai Mongoose connection:

- `GET /` đọc qua `BookRead` và `readConnection`.
- `POST /books` ghi qua `BookWrite` và `writeConnection`.
- Session được lưu trong collection `sessions`, không dùng `MemoryStore`; `connect-mongo` tái sử dụng write client đã kết nối tới Atlas.
- Collection sách là `books`.

## 5. Git branching

Nếu muốn tạo lịch sử branch đúng yêu cầu:

```bash
git init
git branch -M main
git add .
git commit -m "chore: initialize project for 23IT262"

git checkout -b feature/database
git add .
git commit -m "feat: implement database architecture for 23IT262"
git checkout main
git merge --no-ff feature/database -m "merge: database feature"

git checkout -b feature/session
git add .
git commit -m "feat: implement stateless session"
git checkout main
git merge --no-ff feature/session -m "merge: session feature"

git log --graph --oneline --all
```

Không commit `.env` hoặc `node_modules/`.

## 6. Kiểm thử chức năng

Case sai prefix:

- Mã: `999-TEST`
- Kết quả: bị chặn với thông báo mã phải bắt đầu bằng `262`.
- Không gọi `BookWrite.create`, nên không lưu vào database.

Case đúng prefix:

- Mã: `262-TEST`
- Tên: `Giáo trình Điện toán đám mây`
- Giá: `100000`
- VAT: `6%`
- Giá sau thuế: `106000`

Lệnh test logic không cần MongoDB:

```bash
npm test
```

## 7. Render deployment

Tạo Web Service từ repository GitHub `cloud-book-23IT262`.

- Build Command: `npm install`
- Start Command: `npm start`

Environment Variables trên Render:

```text
NODE_ENV=production
MONGO_READ_URI=<read URI thật, nhập trực tiếp trên Render>
MONGO_WRITE_URI=<write URI thật, nhập trực tiếp trên Render>
MONGO_SESSION_URI=<session URI thật, nhập trực tiếp trên Render>
SESSION_SECRET=<secret thật, nhập trực tiếp trên Render>
```

Không đưa URI MongoDB hoặc password thật vào source code, README, GitHub hay file `.env` đã commit.

## 8. Checklist chấm bài

- [x] Hiển thị Nguyễn Thành Thịnh trên giao diện.
- [x] Hiển thị MSSV `23IT262`.
- [x] Prefix được suy ra là `262`.
- [x] VAT được suy ra là `6%` theo công thức `(chữ số cuối MSSV + 4)%`.
- [x] Có route `GET /verify`.
- [x] Tên database là `DB_23IT262`.
- [x] Mã sai prefix bị chặn ở backend.
- [x] Mã đúng prefix được lưu bằng `BookWrite`.
- [x] Giá sau thuế được backend tự tính.
- [x] Session dùng `express-session` + `connect-mongo`.
- [x] Có collection `books` và `sessions`.
- [x] Có tách read/write connection.
- [x] `.env` nằm trong `.gitignore`.
- [x] Có hướng dẫn Git branching và Render deployment.
- [x] Footer lấy tên, MSSV và VAT động từ backend.
