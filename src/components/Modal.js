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
  //만나이 계산 함수
  const calculateKoreanAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();

    // 생일이 아직 지나지 않았다면 1을 빼줍니다.
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age -= 1;
    }

    return age;
  };

  //전화번호 유효성 검사 추가
  const validatePhoneNumber = (phone) => {
    const pattern = /^\d{3}-\d{4}-\d{4}$/;
    return pattern.test(phone);
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (!Number.isSafeInteger(Number(customerTypePk.current.value))) {
      alert("고객유형에 올바른 숫자를 입력해주세요.");
      return;
    }
    //전화번호 유효성 검사 추가
    if (!validatePhoneNumber(phone.current.value)) {
      alert("전화번호 형태가 올바르지 않습니다.");
      return;
    }
    const birthValue = birth.current.value.replace(/\./g, "-");
    const ageValue = calculateKoreanAge(birthValue);

    const data = {
      customerTypePk: parseInt(customerTypePk.current.value),
      liPk: liPk.current.value,
      name: name.current.value,
      birth: birthValue,
      age: ageValue,
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
        if (error.response && error.response.status === 401) {
          // accessToken 만료된 경우
          axios
            .post(
              /* refreshToken을 사용하여 새 accessToken 요청 URL */ {
                refreshToken: localStorage.getItem("refreshToken"),
              }
            )
            .then((tokenResponse) => {
              // 새로 받은 accessToken을 저장하고 원래의 요청을 다시 시도
              localStorage.setItem(
                "accessToken",
                tokenResponse.data.accessToken
              );
              handleSubmit(); // 원래의 요청을 다시 시도
            })
            .catch((tokenError) => {
              console.error("토큰 갱신 실패:", tokenError.message);
            });
        } else {
          console.error("API 요청 에러:", error.message);
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
