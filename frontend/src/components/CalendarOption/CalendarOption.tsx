//login.tsx
import { useNavigate } from "react-router-dom";
import "./CalendarOptionStyled.css";
import axiosInstance from "../../utils/axios";
import { useEffect, useState } from "react";

interface UserInfo {
  userId: string;
  userName: string;
}

const CalendarOption = () => {
  const navigate = useNavigate();

  const [userinfo, setUserInfo] = useState<UserInfo | null>(null);

  // 토큰 검증
  const verifyToken = async () => {
    const res = await axiosInstance.get("/auth/verify");
    setUserInfo(res.data.user);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  // 로그인 페이지 이동
  const movePage = () => {
    navigate("/login");
  };

  // 로그아웃
  const Logout = async () => {
    const res = await axiosInstance.post("/auth/logout");
    if (res.status === 200) {
      alert("로그아웃 되었습니다.");
      navigate("/login");
    }
  };

  return (
    <div className="calendar-option-container">
      {userinfo ? (
        <>
          <div>{userinfo.userName}님 환영합니다.</div>
          <div className="calendar-option-button" onClick={() => Logout()}>
            Logout
          </div>
        </>
      ) : (
        <div className="calendar-option-button" onClick={() => movePage()}>
          Login
        </div>
      )}
    </div>
  );
};

export default CalendarOption;
