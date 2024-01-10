import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const months = Array.from(
  { length: 12 },
  (_, i) => (i + 1).toString().padStart(2, "0") + "월",
);

const DateChangeAModal = ({
  initialYear,
  initialMonth,
  onDateChange,
  onClose,
}) => {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [mode, setMode] = useState("month"); // month or year

  const imageUrl = process.env.PUBLIC_URL + "/icons8-arrow-24.png";

  const handleMonthClick = (selectedMonth) => {
    setMonth(selectedMonth);
    handleSaveClick(selectedMonth); // 새로운 month로 handleSaveClick 호출
  };

  const handleYearClick = (selectedYear) => {
    setYear(selectedYear);
    setMode("month"); // Switch to month selection after selecting a year
  };

  const renderMonthButtons = () =>
    months.map((m, idx) => (
      <button
        key={idx}
        onClick={() => handleMonthClick(idx + 1)}
        class={`h-12 w-[120px] ${
          idx + 1 === month
            ? "font-bold text-primary-100"
            : "font-light text-gray-400"
        } bg-white py-[14px] text-[15px] `}
        active={idx + 1 === month} // Highlight the button if it represents the selected month
      >
        {m}
      </button>
    ));

  const renderYearButtons = () =>
    Array.from({ length: 12 }, (_, i) => year - 4 + i).map((y) => (
      <button
        key={y}
        onClick={() => handleYearClick(y)}
        class={`h-12 w-[120px] ${
          y === year ? "font-bold text-primary-100" : "font-light text-gray-400"
        }  bg-white py-[14px] text-[15px]  `}
        active={y === year} // Highlight the button if it represents the selected year
      >
        {y}년
      </button>
    ));

  const handleSaveClick = (newMonth) => {
    onDateChange(year, newMonth);
    onClose();
  };

  return (
    <Modal className="date-modal-style" show={true} onHide={onClose}>
      <div class="mr-4 h-4" closeButton>
        <div class="flex items-center">
          <img
            className="select"
            class="mr-3 h-5 w-5 cursor-default"
            src={imageUrl}
          />
          {mode === "month" ? (
            <Button
              onClick={() => setMode("year")}
              class="bg-white text-sm font-bold text-gray-400"
            >
              {year}년
            </Button>
          ) : (
            <Button
              onClick={() => setMode("month")}
              class="bg-white text-sm font-bold text-gray-400"
            >
              {month}월
            </Button>
          )}
        </div>
      </div>
      <div class="mt-6">
        {mode === "month" ? renderMonthButtons() : renderYearButtons()}
      </div>
      {/* <div class="mr-[52px] mt-3 flex justify-end">
        <button onClick={handleSaveClick}>저장</button>
      </div> */}
    </Modal>
  );
};

export default DateChangeAModal;
