import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();

// 회원가입 엔드포인트
router.post("/signup", async (req, res) => {
  try {
    const { id, name, password } = req.body;

    // 필수 필드 검증
    if (!id || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "모든 필드를 입력해주세요.",
      });
    }

    // 사용자 ID 중복 확인
    const existingUser = await User.findOne({
      where: { userId: id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "이미 존재하는 사용자 ID입니다.",
      });
    }

    // 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 새 사용자 생성
    const newUser = await User.create({
      userId: id,
      name: name,
      password: hashedPassword,
    });

    // 응답에서 비밀번호 제외
    const userResponse = {
      id: newUser.id,
      userId: newUser.userId,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };

    console.log("✅ 회원가입 성공:", userResponse);

    res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      user: userResponse,
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

// 사용자 정보 조회 엔드포인트
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      where: { userId: userId },
      attributes: { exclude: ["password"] }, // 비밀번호 제외
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("❌ 사용자 정보 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// 모든 사용자 목록 조회 (관리자용)
router.get("/list", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // 비밀번호 제외
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      users: users,
      count: users.length,
    });
  } catch (error) {
    console.error("❌ 사용자 목록 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

export default router;
