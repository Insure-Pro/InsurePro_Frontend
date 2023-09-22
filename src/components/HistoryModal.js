import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

const HistoryModal = ({ onAddHistory }) => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [memo, setMemo] = useState("");

  const progressOptions = ["AP", "APC", "APC1", "APC2", "APC", "PC"];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    const history = {
      progress,
      date,
      location,
      memo,
    };
    onAddHistory(history);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>고객 히스토리 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>진척도</Form.Label>
              <Form.Control
                as="select"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              >
                {progressOptions.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>일정시간</Form.Label>
              <Form.Control
                type="text"
                placeholder="MM/DD"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>장소</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>상담메모</Form.Label>
              <Form.Control
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HistoryModal;
