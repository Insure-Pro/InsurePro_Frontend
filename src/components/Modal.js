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
  const phone = useNavigate();
  const memo = useNavigate();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    // const formData = new FormData();
    const data = {
      customerTypePk: customerTypePk.current.value,
      liPk: liPk.current.value,
      name: name.current.value,
      birth: birth.current.value,
      age: parseInt(age.current.value),
      address: address.current.value,
      phone: phone.current.value,
      memo: memo.current.value,
    };

    axios
      .post("http://52.79.81.200:8080/v1/customers", {
        customerTypePk: customerTypePk.current.value,
        liPk: liPk.current.value,
        name: name.current.value,
        birth: birth.current.value,
        age: parseInt(age.current.value),
        address: address.current.value,
        phone: phone.current.value,
        memo: memo.current.value,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          alert("신규고객 등록이 완료되었습니다.");
          navigate("/Main");
        }
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
          <Form>
            <Form.Group className="mb-0" controlId="name.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control type="name" placeholder="이름" autoFocus />
            </Form.Group>
            <Form.Group className="mb-0" controlId="example.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="birth"
                placeholder="생년월일 | 1900.00.00 (만 00세)"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="phone"
                placeholder="연락처 | 010-0000-0000"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="address"
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
                placeholder="메모"
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleClose}
            onSubmit={handleSubmit}
          >
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Modal1;
