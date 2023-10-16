import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import arrowLeft from "../external/icons8-arrow-24.png";
const months = Array.from(
  { length: 12 },
  (_, i) => (i + 1).toString().padStart(2, "0") + "월"
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

  ////////////////////////////////////////////////////
  const handleMonthClick = (selectedMonth) => {
    setMonth(selectedMonth);
    // setMode("year"); // Switch to year mode after selecting a month
  };

  const handleYearClick = (selectedYear) => {
    setYear(selectedYear);
    // setMode("month"); // Switch to month mode after selecting a year
  };

  const handleSaveClick = () => {
    onDateChange(year, month);
    onClose();
  };

  const renderMonthButtons = () =>
    months.map((m, idx) => (
      <Button
        key={idx}
        onClick={() => handleMonthClick(idx + 1)}
        style={{
          width: "150px",
          height: "40px",
          margin: "2px",
          border: "none",
          backgroundColor: "#fff",
          //   color: "#98A2B3",
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
          height: "40px",
          margin: "2px",
          backgroundColor: "#fff",
          //   color: "#98A2B3",
          color: y === year ? "#000" : "#98A2B3",
        }}
        active={y === year} // Highlight the button if it represents the selected year
      >
        {y}년
      </Button>
    ));
  //////////////////////////////////////////////

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDateChange(year, month);
  };

  return (
    <Modal show={true} onHide={onClose} style={{ marginTop: "130px" }}>
      <Modal.Header closeButton>
        <Modal.Title style={{ justifyContent: "center" }}>
          <img
            className="select"
            src={arrowLeft}
            style={{
              width: "20px",
              height: "20px",
              marginLeft: "4px",
              marginRight: "-8px",
              cursor: "pointer",
            }}
          />
          {mode === "month" ? (
            <Button
              onClick={() => setMode("year")}
              //   variant="link"
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                backgroundColor: "#fff",
                border: "none",
                color: "#98A2B3",
              }}
            >
              {year}년
            </Button>
          ) : (
            <Button
              onClick={() => setMode("month")}
              //   variant="link"
              style={{
                fontWeight: "bold",
                backgroundColor: "#fff",
                border: "none",
                color: "#98A2B3",
              }}
            >
              {month}월
            </Button>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mode === "month" ? renderMonthButtons() : renderYearButtons()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSaveClick}>
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DateChangeModal;
