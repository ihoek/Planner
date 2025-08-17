//login.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./LoginStyled.css";

const Login = () => {
  const navigate = useNavigate();

  //로그인 폼 데이터
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  //회원가입 페이지로 이동
  const movePage = () => {
    navigate("/signup");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직 구현
    console.log("로그인 시도:", formData);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="ID"
              className="login-input"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="login-input"
              required
            />
          </div>
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        <div className="login-signup-container">
          <p className="login-signup" onClick={() => movePage()}>
            회원가입
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
