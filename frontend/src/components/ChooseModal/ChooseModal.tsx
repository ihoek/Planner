// 캘린더 날짜 선택 모달
import "./ChooseModal.css";
import TimeLine from "../TimeLine/TimeLine.tsx";
import { useScheduleStore } from "../../store/scheduleStore";
import { useUserStore } from "../../store/userStore";

interface ChooseModalProps {
  date: Date;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

const ChooseModal = ({ date, setIsModalOpen }: ChooseModalProps) => {
  const { addSchedule, selectedTimeSlots } = useScheduleStore();
  const { isAuthenticated } = useUserStore();

  const handleSave = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 선택된 시간 슬롯들을 스케줄로 저장
    const dateString = date.toISOString().split("T")[0];
    const timeSlots = selectedTimeSlots
      .filter((slot) => slot.startsWith(dateString))
      .map((slot) => ({
        time: slot.split("-")[1],
        status: "selected" as const,
      }));

    addSchedule(dateString, timeSlots);

    console.log("저장되었습니다!", { date: dateString, timeSlots });
    setIsModalOpen(false);
  };

  return (
    <div className="choose-modal-container">
      <div className="modal-content">
        <div className="choose-modal-header">
          <span className="choose-modal-date">{date.toLocaleDateString()}</span>
          <span
            className="choose-modal-close"
            onClick={() => setIsModalOpen(false)}
          >
            ×
          </span>
        </div>
        <div className="choose-modal-content">
          <TimeLine date={date} />
        </div>
        <div className="choose-modal-footer">
          <button className="save-button" onClick={handleSave}>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModal;
