//Signup.tsx
import { useState } from "react";
import "./SignupStyled.css";

const Signup = () => {
  //회원가입 폼 데이터
  const [formData, setFormData] = useState({
    id: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 회원가입 로직 구현
    console.log("회원가입 시도:", formData);
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="id"
              value={formData.id}
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
