import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function HistoryModal({ customerPk, onNewData }) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedProgressType, setSelectedProgressType] = useState("");
  const progressTypes = ["TA", "AP", "PT", "PC"];

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const add_icon = process.env.PUBLIC_URL + "/add_button.png";

  const handleClose = () => {
    setShow(false);
    setDate("");
    setAddress("");
    setMemo("");
    setSelectedProgressType("");
  };
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
    let formattedDateValue = date.replace(/[./]/g, "-");
    const formData = {
      date: formattedDateValue,
      address,
      memo,
      progress: selectedProgressType,
      delYn: "false",
    };
    try {
      await axios.post(`${MAIN_URL}/schedule/${customerPk}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      handleClose();
      onNewData();
    } catch (err) {
      console.log(formData);
      console.error("Error while submitting data", err);
    }
  };

  return (
    <>
      <button
        className="Add_Btn2"
        onClick={handleShow}
        style={{
          display: "flex",
          width: "16px",
          height: "16px",
          paddingTop: "2.5px",
          marginLeft: "4px",
        }}
      >
        <img src={add_icon} class="ml-1.5 mt-0.5" />
      </button>

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
                  userSelect: "none",
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
              <Form.Label
                style={{
                  marginTop: "12px",
                  paddingLeft: "2px",
                  userSelect: "none",
                }}
              >
                일정시간
              </Form.Label>
              <Form.Control
                type="date"
                placeholder="YYYY-MM-DD"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label
                style={{
                  marginTop: "12px",
                  paddingLeft: "2px",
                  userSelect: "none",
                }}
              >
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
              <Form.Label
                style={{
                  marginTop: "12px",
                  paddingLeft: "2px",
                  userSelect: "none",
                }}
              >
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

export default HistoryModal;
