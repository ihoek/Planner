//login.tsx
import { useNavigate } from "react-router-dom";
import "./CalendarOptionStyled.css";

const CalendarOption = () => {
  const navigate = useNavigate();

  const movePage = () => {
    navigate("/login");
  };

  return (
    <div className="calendar-option-container">
      <div className="calendar-option-button" onClick={() => movePage()}>
        Login
      </div>
    </div>
  );
};

export default CalendarOption;
