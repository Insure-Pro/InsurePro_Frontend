import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function Modal1() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const customerTypePk = useRef("");
  const liPk = useRef("");
  const name = useRef("");
  const birth = useRef("");
  const age = useRef("");
  const address = useRef("");
  const phone = useRef("");
  const memo = useRef("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (!Number.isSafeInteger(Number(customerTypePk.current.value))) {
      alert("고객유형에 올바른 숫자를 입력해주세요.");
      return;
    }
    // const formData = new FormData();
    const data = {
      customerTypePk: parseInt(customerTypePk.current.value),
      liPk: liPk.current.value,
      name: name.current.value,
      birth: birth.current.value.replace(/\./g, "-"),
      age: parseInt(age.current.value),
      address: address.current.value,
      phone: phone.current.value,
      memo: memo.current.value,
      intensiveCareStartDate: "2023-09-04",
      intensiveCareFinishDate: "2023-10-04",
      registerDate: "2023-09-03",
    };

    axios
      .post("http://52.79.81.200:8080/v1/customer", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          alert("신규고객 등록이 완료되었습니다.");
          navigate("/Main");
          handleClose(); // Modal 창 닫기
        }
      })
      .catch((error) => {
        console.error("API 요청 에러:", error.message);
      });
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        + Add
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>신규고객 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-0" controlId="name.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control type="text" ref={name} placeholder="이름" />
            </Form.Group>
            <Form.Group className="mb-0" controlId="name.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="customerTypePk"
                ref={customerTypePk}
                placeholder="고객유형"
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="example.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="birth"
                ref={birth}
                placeholder="생년월일 | 1900.00.00 (만 00세)"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="phone"
                ref={phone}
                placeholder="연락처 | 010-0000-0000"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="address"
                ref={address}
                placeholder="거주지 | 주소입력"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-0"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label></Form.Label>
              <Form.Control
                type="memo"
                ref={memo}
                placeholder="메모"
                as="textarea"
                rows={3}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                취소
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

export default Modal1;
