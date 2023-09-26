import axios from "axios";
import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import { useLocation } from "react-router-dom";
function HistoryModal({ customerPk, onNewData }) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedProgressType, setSelectedProgressType] = useState("");
  const progressTypes = ["AP", "APC1", "APC2", "APC", "PC"];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleProgressTypeClick = (type) => {
    if (selectedProgressType === type) {
      setSelectedProgressType("");
    } else {
      setSelectedProgressType(type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      date,
      address,
      memo,
      progress: selectedProgressType,
    };

    try {
      await axios.post(
        `http://52.79.81.200:8080/v1/schedule/${customerPk}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      handleClose();
      onNewData();
    } catch (err) {
      console.log(formData);
      console.error("Error while submitting data", err);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        style={{ alignItems: "center" }}
      >
        Edit
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
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
                  borderColor: "#DEE2E5",
                  backgroundColor: "transparent",
                  color: "#585C5E",
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
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>메모</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                저장
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

// const formatToValidDate = (inputDate) => {
//   let cleanedDate = inputDate.replace(/[^0-9]/g, "");

//   if (cleanedDate.length !== 8) {
//     return null;
//   }
//   return `${cleanedDate.substring(0, 4)}-${cleanedDate.substring(
//     4,
//     6
//   )}-${cleanedDate.substring(6, 8)}`;
// };
export default HistoryModal;
// const formatToValidDate = (inputDate) => {
//   let cleanedDate = inputDate.replace(/[^0-9]/g, "");

//   if (cleanedDate.length !== 8) {
//     return null;
//   }
//   return `${cleanedDate.substring(0, 4)}-${cleanedDate.substring(
//     4,
//     6
//   )}-${cleanedDate.substring(6, 8)}`;
// };
