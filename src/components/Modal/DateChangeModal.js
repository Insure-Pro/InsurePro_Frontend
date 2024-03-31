import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const months = Array.from(
  { length: 12 },
  (_, i) => (i + 1).toString().padStart(2, "0") + "월",
);

const DateChangeModal = ({
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
  };

  const handleYearClick = (selectedYear) => {
    setYear(selectedYear);
  };

  const renderMonthButtons = () =>
    months.map((m, idx) => (
      <Button
        key={idx}
        onClick={() => handleMonthClick(idx + 1)}
        style={{
          width: "150px",
          height: "44px",
          margin: "2px",
          border: "none",
          backgroundColor: "#fff",
          color: idx + 1 === month ? "#000" : "#98A2B3",
        }}
        active={idx + 1 === month} // Highlight the button if it represents the selected month
      >
        {m}
      </Button>
    ));

  const renderYearButtons = () =>
    Array.from({ length: 12 }, (_, i) => year - 4 + i).map((y) => (
      <Button
        key={y}
        onClick={() => handleYearClick(y)}
        style={{
          width: "150px",
          height: "44px",
          margin: "2px",
          border: "none",
          backgroundColor: "#fff",
          color: y === year ? "#000" : "#98A2B3",
        }}
        active={y === year} // Highlight the button if it represents the selected year
      >
        {y}년
      </Button>
    ));

  const handleSaveClick = () => {
    onDateChange(year, month);
    onClose();
  };

  return (
    <Modal
      className="date-modal-style"
      show={true}
      onHide={onClose}
      style={{ marginTop: "130px" }}
    >
      <Modal.Header closeButton style={{ marginRight: "16px" }}>
        <div
          class="bg-red-400"
          style={{ justifyContent: "center", marginBottom: "-16px" }}
        >
          <img
            className="select"
            src={imageUrl}
            style={{
              width: "24px",
              height: "24px",
              marginLeft: "4px",
              marginRight: "-8px",
              cursor: "pointer",
              padding: "0px",
              marginBottom: "14px",
            }}
          />
          {mode === "month" ? (
            <Button
              onClick={() => setMode("year")}
              style={{
                fontWeight: "bold",
                fontSize: "24px",
                backgroundColor: "#fff",
                border: "none",
                color: "#98A2B3",
                padding: "0px 8px",
                paddingBottom: "16px",
                marginLeft: "8px",
              }}
            >
              {year}년
            </Button>
          ) : (
            <Button
              onClick={() => setMode("month")}
              style={{
                fontWeight: "bold",
                fontSize: "24px",
                backgroundColor: "#fff",
                border: "none",
                color: "#98A2B3",
                padding: "0px 8px",
                paddingBottom: "16px",
                marginLeft: "8px",
              }}
            >
              {month}월
            </Button>
          )}
        </div>
      </Modal.Header>
      <Modal.Body>
        {mode === "month" ? renderMonthButtons() : renderYearButtons()}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSaveClick}
          style={{ marginRight: "16px" }}
        >
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DateChangeModal;
