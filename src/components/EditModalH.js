import axios from "axios";
import { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import { useLocation } from "react-router-dom";

function HistoryModalH({
  onHide,
  selectedHistory,
  onHistoryUpdated,
  schedule_pk,
  onNewData,
}) {
  const [show, setShow] = useState(false);
  const dateRef = useRef("");
  const addressRef = useRef("");
  const memoRef = useRef("");
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
  const [updatedHistory, setUpdatedHistory] = useState(selectedHistory);

  useEffect(() => {
    setUpdatedHistory(selectedHistory);
  }, [selectedHistory]);

  //   const handleSaveClick = async () => {
  //     try {
  //       const response = await axios.patch(
  //         `http://3.38.101.62:8080/v1/schedule/${selectedHistory.pk}`,
  //         updatedHistory, // 변경된 히스토리 데이터
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           },
  //         }
  //       );
  //       if (response.status === 200) {
  //         onHide(); // 모달 닫기
  //         onHistoryUpdated(); // 상위 컴포넌트에 변경사항 알리기
  //       }
  //     } catch (error) {
  //       console.error("Error updating history:", error);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      date: dateRef.current.value,
      address: addressRef.current.value,
      memo: memoRef.current.value,
      progress: selectedProgressType,
    };

    try {
      const response = await axios.patch(
        `http://3.38.101.62:8080/v1/schedule/${selectedHistory.pk}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status === 200) {
        onHide(); // 모달 닫기
        onHistoryUpdated(); // 상위 컴포넌트에 변경사항 알리기
        handleClose();
        onNewData();
      }
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
        style={{
          alignItems: "center",
          backgroundColor: "#175CD3",
          boxShadow: "5px 4px 4px 0px rgba(46, 64, 97, 0.30)",
        }}
      >
        + Add
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>히스토리 추가하기</Modal.Title>
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
              <Form.Label style={{ marginTop: "12px", paddingLeft: "2px" }}>
                일정시간
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="YYYY-MM-DD"
                defaultValue={selectedHistory?.date}
                ref={dateRef}
                autoFocus
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ marginTop: "12px", paddingLeft: "2px" }}>
                장소
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                defaultValue={selectedHistory?.address}
                ref={addressRef}
                autoFocus
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ marginTop: "12px", paddingLeft: "2px" }}>
                메모
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                defaultValue={selectedHistory?.memo}
                ref={memoRef}
                autoFocus
              />
            </Form.Group>
            {/* #9BA1B1
            #98A2B3 */}
            <Modal.Footer>
              {/* <Button variant="secondary" onClick={handleClose}>
                닫기
              </Button> */}
              <Button type="submit" variant="primary">
                변경사항 저장
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
export default HistoryModalH;
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
