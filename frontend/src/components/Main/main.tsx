import { useState } from "react";
import Calendar from "react-calendar";
import "./mainstyled.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Main = () => {
  const [value, onChange] = useState<Value>(new Date()); // January 2024

  return (
    <div className="calendar-container">
      <Calendar
        onChange={onChange}
        value={value}
        showNeighboringMonth={true}
        showFixedNumberOfWeeks={false}
      />
    </div>
  );
};

export default Main;
