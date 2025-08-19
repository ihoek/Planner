// 타임라인 컴포넌트
import { useState, useEffect } from "react";
import "./TimeLine.css";
import { useScheduleStore } from "../../store/scheduleStore";

interface TimeLineProps {
  date?: Date;
}

const TimeLine = ({ date = new Date() }: TimeLineProps) => {
  const {
    getSchedule,
    addSchedule,
    selectTimeSlot,
    deselectTimeSlot,
    selectedTimeSlots,
  } = useScheduleStore();

  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  // 00:00부터 24:00까지 30분 단위로 시간 생성
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // 시간 포맷팅 (AM/PM)
  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // 시간대별 상태 결정 (예시 데이터)
  const getSlotStatus = (timeString: string) => {
    const hour = parseInt(timeString.split(":")[0]);

    // 예시: 10:00-13:00, 15:00-19:00은 사용 가능
    if ((hour >= 10 && hour < 13) || (hour >= 15 && hour < 19)) {
      return "available";
    }
    // 예시: 19:00-20:30은 바쁨
    if (hour >= 19 && hour < 20) {
      return "busy";
    }
    return "default";
  };

  // 날짜를 문자열로 변환
  const dateString = date.toISOString().split("T")[0];

  // 기존 스케줄 불러오기
  useEffect(() => {
    const existingSchedule = getSchedule(dateString);
    if (existingSchedule) {
      const selected = new Set(
        existingSchedule.timeSlots
          .filter((slot) => slot.status === "selected")
          .map((slot) => slot.time)
      );
      setSelectedSlots(selected);
    }
  }, [dateString, getSchedule]);

  // 슬롯 클릭 핸들러
  const handleSlotClick = (timeString: string) => {
    const newSelectedSlots = new Set(selectedSlots);
    if (newSelectedSlots.has(timeString)) {
      newSelectedSlots.delete(timeString);
      deselectTimeSlot(dateString, timeString);
    } else {
      newSelectedSlots.add(timeString);
      selectTimeSlot(dateString, timeString);
    }
    setSelectedSlots(newSelectedSlots);
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <div className="timeline-legend">
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>사용 가능</span>
          </div>
          <div className="legend-item">
            <div className="legend-color selected"></div>
            <span>선택됨</span>
          </div>
        </div>
      </div>
      <div className="timeline-grid">
        <div className="timeline-labels">
          {timeSlots.map((timeString) => {
            const minute = parseInt(timeString.split(":")[1]);

            // 정시에만 라벨 표시
            if (minute === 0) {
              return (
                <div key={timeString} className="time-label">
                  {formatTime(timeString)}
                </div>
              );
            }
            return <div key={timeString} className="time-label"></div>;
          })}
        </div>

        <div className="timeline-slots">
          {timeSlots.map((timeString) => {
            const status = getSlotStatus(timeString);
            const isSelected = selectedSlots.has(timeString);

            return (
              <div
                key={timeString}
                className={`time-slot ${status} ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => handleSlotClick(timeString)}
                title={`${formatTime(timeString)} - ${status}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeLine;
