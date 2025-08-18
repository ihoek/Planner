import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
  try {
    const { id, password } = req.body;

    // 필수 필드 검증
    if (!id || !password) {
      return res.status(400).json({
        success: false,
        message: "아이디와 비밀번호를 입력해주세요.",
      });
    }

    const [users] = await sequelize.query(
      "SELECT * FROM user WHERE userid = ?",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "존재하지 않는 사용자입니다.",
      });
    }

    const user = users;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    // 액세스 토큰 생성 (15분 유효)
    const accessToken = jwt.sign(
      {
        userId: user.userid,
        userName: user.name,
        userNo: user.id,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "15m" } // 15분 유효
    );

    // 리프레시 토큰 생성 (만료 시간 없음)
    const refreshToken = jwt.sign(
      {
        userId: user.userid,
        userNo: user.id,
        type: "refresh",
      },
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
      // expiresIn 옵션 제거 - 토큰이 만료되지 않음
    );

    // 액세스 토큰 쿠키 설정 (15분)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15분
      path: "/",
    });

    // 리프레시 토큰 쿠키 설정 (만료 시간 없음)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // 응답에서 비밀번호 제외
    const userResponse = {
      userid: user.userid,
      name: user.name,
      userNo: user.id,
    };

    console.log("✅ 로그인 성공:", userResponse);

    res.status(200).json({
      success: true,
      message: "로그인 성공",
      user: userResponse,
    });
  } catch (error) {
    console.error("❌ 로그인 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// 로그아웃 라우터
router.post("/logout", (req, res) => {
  try {
    // 액세스 토큰 쿠키 삭제
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // 리프레시 토큰 쿠키 삭제
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    console.log("✅ 로그아웃 성공");

    res.status(200).json({
      success: true,
      message: "로그아웃이 완료되었습니다.",
    });
  } catch (error) {
    console.error("❌ 로그아웃 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// 인증 상태 확인 라우터
router.get("/verify", (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        success: false,
        message: "로그인이 필요합니다.",
      });
    }

    // 액세스 토큰 검증 시도
    if (accessToken) {
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.JWT_SECRET || "your-secret-key"
        );

        res.status(200).json({
          success: true,
          message: "인증이 유효합니다.",
          user: decoded,
        });
        return;
      } catch (accessError) {
        console.log("액세스 토큰 만료, 리프레시 토큰으로 갱신 시도");
      }
    }

    // 액세스 토큰이 없거나 만료된 경우, 리프레시 토큰으로 갱신
    if (refreshToken) {
      try {
        const refreshDecoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
        );

        // 리프레시 토큰이 유효하면 새로운 액세스 토큰 생성
        const newAccessToken = jwt.sign(
          {
            userId: refreshDecoded.userId,
            userName: refreshDecoded.userName,
            userNo: refreshDecoded.userNo,
          },
          process.env.JWT_SECRET || "your-secret-key",
          { expiresIn: "15m" }
        );

        // 새로운 액세스 토큰 쿠키 설정
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15분
          path: "/",
        });

        res.status(200).json({
          success: true,
          message: "토큰이 갱신되었습니다.",
          user: {
            userId: refreshDecoded.userId,
            userNo: refreshDecoded.userNo,
          },
        });
        return;
      } catch (refreshError) {
        console.error("리프레시 토큰 검증 실패:", refreshError);
      }
    }

    // 모든 토큰이 유효하지 않은 경우
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(401).json({
      success: false,
      message: "인증이 만료되었습니다. 다시 로그인해주세요.",
    });
  } catch (error) {
    console.error("❌ 인증 확인 실패:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

// 토큰 갱신 전용 라우터
router.post("/refresh", (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "리프레시 토큰이 없습니다.",
      });
    }

    // 리프레시 토큰 검증
    const refreshDecoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
    );

    // 새로운 액세스 토큰 생성
    const newAccessToken = jwt.sign(
      {
        userId: refreshDecoded.userId,
        userName: refreshDecoded.userName,
        userNo: refreshDecoded.userNo,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "15m" }
    );

    // 새로운 액세스 토큰 쿠키 설정
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15분
      path: "/",
    });

    console.log("✅ 토큰 갱신 성공");

    res.status(200).json({
      success: true,
      message: "토큰이 갱신되었습니다.",
      user: {
        userId: refreshDecoded.userId,
        userNo: refreshDecoded.userNo,
      },
    });
  } catch (error) {
    console.error("❌ 토큰 갱신 실패:", error);

    // 리프레시 토큰이 유효하지 않으면 쿠키 삭제
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(401).json({
      success: false,
      message: "리프레시 토큰이 유효하지 않습니다. 다시 로그인해주세요.",
    });
  }
});

export default router;
