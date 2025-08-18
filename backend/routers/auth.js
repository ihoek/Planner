import express from "express";
import bcrypt from "bcrypt";
import { sequelize } from "../db.js";

const router = express.Router();

// 회원가입 라우터
router.post("/signup", async (req, res) => {
  try {
    const { userid, name, password } = req.body;

    // 필수 필드 검증
    if (!userid || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "모든 필드를 입력해주세요.",
      });
    }

    // 사용자 ID 중복 확인
    const [existingUsers] = await sequelize.query(
      "SELECT * FROM user WHERE userid = ?",
      {
        replacements: [userid],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingUsers != undefined && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "이미 존재하는 사용자 ID입니다.",
      });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const [result] = await sequelize.query(
      "INSERT INTO user (userid, name, password) VALUES (?, ?, ?)",
      {
        replacements: [userid, name, hashedPassword],
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      user: result,
    });
  } catch (error) {
    console.error("❌ 회원가입 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// 로그인 라우터
router.post("/login", async (req, res) => {
  const { id, password } = req.body;
  const [user] = await sequelize.query("SELECT * FROM user WHERE userid = ?", {
    replacements: [id],
    type: sequelize.QueryTypes.SELECT,
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "존재하지 않는 사용자입니다.",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "비밀번호가 일치하지 않습니다.",
    });
  }

  res.status(200).json({
    success: true,
    message: "로그인 성공",
    user: user,
  });
  return;
});

export default router;
