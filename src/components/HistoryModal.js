import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남

function HistoryModal({ customerPk, onNewData }) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedProgressType, setSelectedProgressType] = useState("");
  const progressTypes = ["TA", "AP", "PT", "PC"];

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
      delYn: "false",
    };

    try {
      await axios.post(
        `https://www.insurepro.kro.kr/v1/schedule/${customerPk}`,
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
        className="history_Add_Btn"
        variant="primary"
        onClick={handleShow}
        style={{
          alignItems: "center",
          backgroundColor: "#175CD3",
          boxShadow: "5px 4px 4px 0px rgba(46, 64, 97, 0.30)",
        }}
      >
        + Add
      </Button>
      <Modal show={show} onHide={handleClose} style={{ marginTop: "130px" }}>
        <Modal.Header closeButton style={{ marginRight: "16px" }}>
          <Modal.Title>히스토리 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body className="Modal_container">
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
                  style={{ borderRadius: "0px" }}
                >
                  {type}
                </ToggleButton>
              ))}
            </ButtonGroup>
            <Form.Group>
              <Form.Label style={{ marginTop: "12px", paddingLeft: "2px" }}>
                일정시간
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="YYYY-MM-DD"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ marginTop: "12px", paddingLeft: "2px" }}>
                장소
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ marginTop: "12px", paddingLeft: "2px" }}>
                메모
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </Form.Group>

            <Modal.Footer style={{ marginRight: "-12px" }}>
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
