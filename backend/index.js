import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { sequelize } from "./db.js";

// 라우터
import authRouter from "./routers/auth.js";
import timeRouter from "./routers/time.js";

dotenv.config();

const app = express();
const PORT = 5000;

// CORS 허용
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// 라우터 설정
app.use("/auth", authRouter); // user 관리
app.use("/time", timeRouter); // 시간 관리

// MySQL 연결
async function testDBConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL 연결 성공");
  } catch (error) {
    console.error("❌ MySQL 연결 실패:", error);
  }
}
testDBConnection();

// API 예시
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});

// 데이터베이스 상태 확인 API
app.get("/api/db-status", async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log("✅ 데이터베이스 상태 확인 성공");
    res.json({
      status: "success",
      message: "데이터베이스 연결 정상",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ 데이터베이스 상태 확인 실패:", error);
    res.status(500).json({
      status: "error",
      message: "데이터베이스 연결 실패",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    "📊 데이터베이스 연결 상태를 확인하려면: http://localhost:5000/api/db-status"
  );
});
