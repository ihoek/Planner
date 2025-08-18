//Signup.tsx
import { useState } from "react";
import "./SignupStyled.css";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  //회원가입 폼 데이터
  const [formData, setFormData] = useState({
    userid: "",
    name: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/signup", formData);
      console.log("회원가입 성공:", response.data);
      // 회원가입 성공 시 폼 초기화
      setFormData({
        userid: "",
        name: "",
        password: "",
      });
      alert("회원가입 성공");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="userid"
              value={formData.userid}
              onChange={handleChange}
              placeholder="ID"
              className="signup-input"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="signup-input"
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
              className="signup-input"
              required
            />
          </div>
          <button type="submit" className="signup-button">
            가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
