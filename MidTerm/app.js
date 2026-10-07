require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { engine } = require("express-handlebars");

const STUDENT = require("./constants/student");
const { connectDatabases, writeConnection } = require("./config/database");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const port = Number(process.env.PORT) || 3000;

if (!process.env.MONGO_SESSION_URI) {
  throw new Error("Thiếu biến môi trường MONGO_SESSION_URI. Hãy tạo file .env từ .env.example.");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("Thiếu biến môi trường SESSION_SECRET. Hãy tạo file .env từ .env.example.");
}

// Reuse the established write client for connect-mongo. This keeps session
// persistence in Atlas while avoiding a third independent TLS connection.
const sessionClientPromise = writeConnection
  .asPromise()
  .then((connection) => connection.getClient());

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      formatCurrency(value) {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 2,
        }).format(value);
      },
    },
  }),
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise: sessionClientPromise,
      dbName: STUDENT.databaseName,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use((req, res, next) => {
  res.locals.student = STUDENT;
  res.locals.session = req.session;
  next();
});

app.get("/verify", (req, res) => {
  res.render("verify", {
    title: "Xác minh bài làm",
  });
});

app.use("/", bookRoutes);

app.use((req, res) => {
  res.status(404).render("verify", {
    title: "Không tìm thấy trang",
    pageError: "Trang bạn tìm kiếm không tồn tại.",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).render("verify", {
    title: "Lỗi máy chủ",
    pageError: "Đã xảy ra lỗi máy chủ. Vui lòng kiểm tra cấu hình MongoDB Atlas.",
  });
});

async function startServer() {
  await connectDatabases();
  app.listen(port, () => {
    console.log(`Cloud Book đang chạy tại http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Không thể khởi động ứng dụng:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
