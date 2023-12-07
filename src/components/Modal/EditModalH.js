import axios from "axios";
import { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function HistoryModalH({ show, onClose, onHide, selectedHistory }) {
  const dateRef = useRef("");
  const addressRef = useRef("");
  const memoRef = useRef("");
  const [selectedProgressType, setSelectedProgressType] = useState("");
  const progressTypes = ["TA", "AP", "PT", "PC"];

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  useEffect(() => {
    if (selectedHistory) {
      setSelectedProgressType(selectedHistory?.progress || "");
    }
  }, [selectedHistory]);

  const handleProgressTypeClick = (type) => {
    if (selectedProgressType === type) {
      setSelectedProgressType("");
    } else {
      setSelectedProgressType(type);
    }
  };
  const [updatedHistory, setUpdatedHistory] = useState(selectedHistory);

  useEffect(() => {
    setUpdatedHistory(selectedHistory);
  }, [selectedHistory]);

  const [editedHistory, setEditedHistory] = useState({
    progress: "",
    date: "",
    address: "",
    memo: "",
  });

  useEffect(() => {
    setEditedHistory(selectedHistory);
  }, [selectedHistory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedHistory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const url = `${MAIN_URL}/schedule/${selectedHistory.pk}`;
      await axios.patch(url, editedHistory, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      onClose();
    } catch (error) {
      console.error("Error updating history:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDateValue = dateRef.current.value.replace(/[./]/g, "-");
    const dateSend = formattedDateValue || dateRef.current.value;
    const formData = {
      date: dateSend,
      address: addressRef.current.value,
      memo: memoRef.current.value,
      progress: selectedProgressType,
    };

    try {
      const response = await axios.patch(
        `${MAIN_URL}/schedule/${selectedHistory.pk}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status === 200) {
        onHide(); // 모달 닫기
      }
    } catch (err) {
      console.error("Error while submitting data", err);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} style={{ marginTop: "130px" }}>
        <Modal.Header closeButton style={{ marginRight: "16px" }}>
          <Modal.Title>히스토리 수정</Modal.Title>
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
                  style={{ borderRadius: "0px" }}
                  onClick={() => handleProgressTypeClick(type)}
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
                defaultValue={selectedHistory?.date}
                ref={dateRef}
                autoFocus
                name="date"
                value={editedHistory.date}
                onChange={handleInputChange}
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
                defaultValue={selectedHistory?.address}
                ref={addressRef}
                autoFocus
                name="address"
                value={editedHistory.address}
                onChange={handleInputChange}
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
                defaultValue={selectedHistory?.memo}
                ref={memoRef}
                autoFocus
                name="memo"
                value={editedHistory.memo}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Modal.Footer style={{ marginRight: "-12px" }}>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSaveChanges}
              >
                변경사항 저장
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default HistoryModalH;
