import axios from "axios";
import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import { useLocation } from "react-router-dom";

const HistoryModal = ({ customerPk }) => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    memo: "",
    date: "",
    startTm: "",
    finishTm: "",
    address: "",
    meetYn: false,
    delYn: false,
    // color: "#000000",
    progress: "",
  });

  const formatToValidDate = (inputDate) => {
    let cleanedDate = inputDate.replace(/[^0-9]/g, "");

    if (cleanedDate.length !== 8) {
      return null;
    }
    return `${cleanedDate.substring(0, 4)}-${cleanedDate.substring(
      4,
      6
    )}-${cleanedDate.substring(6, 8)}`;
  };

  const [selectedProgressType, setSelectedProgressType] = useState("");
  const progressTypes = ["AP", "APC1", "APC2", "APC", "PC"];

  const handleProgressTypeClick = (type) => {
    if (selectedProgressType === type) {
      setSelectedProgressType("");
    } else {
      setSelectedProgressType(type);
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = `http://52.79.81.200:8080/v1/schedule/${customerPk}`;
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.status === 201) {
        console.log("History added successfully");
        handleClose();
        // Optionally, you can refresh the CustomerHistory component or give some feedback to the user.
      }
    } catch (error) {
      console.error("Failed to add history", error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        + Edit
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Customer History</Modal.Title>
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
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>장소</Form.Label>
              <Form.Control
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="장소 입력"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Memo</Form.Label>
              <Form.Control
                name="memo"
                value={formData.memo}
                onChange={handleChange}
                placeholder="Memo"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HistoryModal;
