//Main.tsx
import CalendarComponent from "../Calendar/Calendar";
import CalendarOption from "../CalendarOption/CalendarOption";
import "./mainstyled.css";

const Main = () => {
  return (
    <div className="main-container">
      <div className="login-container">
        <CalendarOption />
      </div>
      <div className="calendar-container">
        <CalendarComponent />
      </div>
    </div>
  );
};

export default Main;
