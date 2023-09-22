import axios from "axios";
import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남

const HistoryModal = ({ onAddHistory }) => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [memo, setMemo] = useState("");

  const progressTypes = ["AP", "APC1", "APC2", "APC", "PC"];
  const [selectedProgressType, setSelectedProgressType] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleProgressTypeClick = (type) => {
    console.log("Clicked button:", type);
    console.log("Selected customer type before:", selectedProgressType);
    // 이미 선택된 유형을 다시 클릭하면 선택 해제
    if (selectedProgressType === type) {
      setSelectedProgressType("");
    } else {
      setSelectedProgressType(type);
    }

    console.log("Selected customer type after:", selectedProgressType);
  };
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
            <ButtonGroup>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingRight: "8px",
                  paddingLeft: "8px",
                  marginRight: "24px",
                  borderWidth: "1px",
                  borderRadius: "5px",
                  borderStyle: "solid",
                  borderColor: "#DEE2E5", //  테두리 색 적용
                  backgroundColor: "transparent", // 배경을 투명하게 설정
                  color: "#585C5E", // 글자색을 설정
                }}
              >
                진척도
              </div>
              {progressTypes.map((type, idx) => (
                <ToggleButton
                  key={idx}
                  type="button"
                  variant={
                    selectedProgressType === type
                      ? "primary"
                      : "outline-primary"
                  }
                  // ref={customerTypeName}
                  value={selectedProgressType}
                  onClick={() => handleProgressTypeClick(type)}
                >
                  {type}
                </ToggleButton>
              ))}
            </ButtonGroup>

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
