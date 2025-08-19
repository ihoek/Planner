import { useState } from "react";
import Calendar from "react-calendar";
import "./CalendarStyled.css";
import ChooseModal from "../ChooseModal/ChooseModal.tsx";

const CalendarComponent = () => {
  const [value, onChange] = useState<Date | null>(new Date()); // 선택한 날짜
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부

  // 날짜 선택 함수
  const handleDateChange = (newValue: Date | null) => {
    console.log("선택된 날짜:", newValue);
    onChange(newValue);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="calendar-container">
        <Calendar
          onChange={(value) => handleDateChange(value as Date | null)}
          value={value}
          showNeighboringMonth={true}
          showFixedNumberOfWeeks={false}
        />
      </div>
      {isModalOpen && (
        <ChooseModal date={value as Date} setIsModalOpen={setIsModalOpen} />
      )}
    </>
  );
};

export default CalendarComponent;
