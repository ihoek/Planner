// 캘린더 날짜 선택 모달
import "./ChooseModal.css";
import TimeLine from "../TimeLine/TimeLine.tsx";

interface ChooseModalProps {
  date: Date;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

const ChooseModal = ({ date, setIsModalOpen }: ChooseModalProps) => {
  const handleSave = () => {
    // 저장 로직 구현
    console.log("저장되었습니다!");
    setIsModalOpen(false);

    // 저장 요청 보내기
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
          <TimeLine />
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
