import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { Row, Col } from "react-bootstrap";
import hangjungdong from "./hangjungdong";

function Modal1({ onModalClose }) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    // resetSelections();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const customerType = useRef("");
  const liPk = useRef("");
  const name = useRef("");
  const birth = useRef("");
  const registerDate = useRef("");
  const address = useRef("");
  const phone = useRef("");
  const memo = useRef("");
  const state = useRef("");
  const navigate = useNavigate();
  // 상태에 저장하는 함수 (React의 useState를 사용한다고 가정)
  const [phoneNumber, setPhoneNumber] = useState("");

  // 선택된 고객 유형을 나타내는 state
  const [selectedCustomerType, setSelectedCustomerType] = useState("");
  const [contractYn, setContractYn] = useState(false);

  const customerTypes = ["OD", "AD", "CP", "CD", "JD", "H", "X", "Y", "Z"];

  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigugun, setSelectedSigugun] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const { sido, sigugun, dong } = hangjungdong;

  // console.log(fullAddress);
  const handleContractYnChange = () => {
    // 체크박스 상태를 토글
    setContractYn(!contractYn);
  };

  // 고객 유형 버튼 클릭 핸들러
  const handleCustomerTypeClick = (type) => {
    if (selectedCustomerType === type) {
      setSelectedCustomerType("");
    } else {
      setSelectedCustomerType(type);
    }
  };

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

  // 전화번호 형식에 맞게 변환하는 함수
  const formatPhoneNumber = (phoneNumber) => {
    // 숫자만 추출
    const numbers = phoneNumber.replace(/\D/g, "");
    // 숫자를 그룹으로 나누어 하이픈 추가
    const match = numbers.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    // 하이픈으로 그룹을 결합하여 반환
    return match ? `${match[1]}-${match[2]}-${match[3]}` : numbers;
  };

  // 사용자 입력을 처리하는 함수
  const handlePhoneInputChange = (event) => {
    const formattedNumber = formatPhoneNumber(event.target.value);
    setPhoneNumber(formattedNumber);
    // 여기서 서버에 데이터를 보낼 수 있습니다. 예: Axios를 사용하는 API 호출 등
  };

  const circle_icon = process.env.PUBLIC_URL + "/circle-12.png";
  const circle_icon_middle = process.env.PUBLIC_URL + "/circle-14-4.png";
  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!customerType.current) {
      alert("고객유형을 선택해주세요.");
      return;
    }
    const MAIN_URL = process.env.REACT_APP_MAIN_URL;

    const metroName =
      hangjungdong.sido.find((el) => el.sido === selectedSido)?.codeNm || "";
    const guName =
      hangjungdong.sigugun.find(
        (el) => el.sido === selectedSido && el.sigugun === selectedSigugun
      )?.codeNm || "";

    const dongName =
      hangjungdong.dong.find(
        (el) =>
          el.sido === selectedSido &&
          el.sigugun === selectedSigugun &&
          el.dong === selectedDong
      )?.codeNm || "";

    const metroGuDong = {
      metroName: metroName,
      guName: guName,
      dongName: dongName, // Populate this if needed
    };

    // console.log("Updated fullAddress:", fullAddress);
    const birthValue = birth.current.value.replace(/[./]/g, "-");
    const registerDateValue = registerDate.current.value.replace(/[./]/g, "-");
    const ageValue = calculateKoreanAge(birthValue);
    customerType.current.value = selectedCustomerType;
    phone.current = phone.current; // phone Ref를 업데이트하지 않음
    const data = {
      customerType: selectedCustomerType, // 선택된 고객 유형으로 설정
      name: name.current.value,
      birth: birthValue,
      registerDate: registerDateValue,
      age: ageValue,
      address: address.current.value,
      phone: phoneNumber,
      contractYn: contractYn,
      memo: memo.current.value,
      state: state.current.value,
      metroGuDong: metroGuDong,
    };

    axios
      .post(`${MAIN_URL}/customer`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          alert("신규고객 등록이 완료되었습니다.");
          onModalClose(); // 모달이 닫힐 때 새로고침 상태 변경
          handleClose(); // Modal 창 닫기
          // resetSelections();
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
          // console.log(data);
          console.error("API 요청 에러:", error.message);
        }
      });
  };
  return (
    <>
      <Button
        className="Add_Btn2"
        variant="primary"
        style={{ boxShadow: "4px 4px 4px 0px rgba(46, 64, 97, 0.30)" }}
        onClick={handleShow}
      >
        + Add
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        onExited={onModalClose}
        style={{ marginTop: "60px", overflow: "auto" }}
      >
        <Modal.Header style={{ margin: "0px" }} closeButton>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Modal.Title>신규고객 추가 </Modal.Title>
          </div>
        </Modal.Header>
        <div
          style={{
            display: "flex",
            margin: "4px 18px -16px 0px",
            justifyContent: "end",
          }}
        >
          <img
            src={circle_icon_middle}
            style={{ width: "12px", height: "12px", marginTop: "2px" }}
          />
          <span style={{ fontSize: "12px", justifyContent: "" }}>
            필수입력사항
          </span>
        </div>
        <Modal.Body className="Modal_container" style={{ margin: "-15px 0px" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group
              className="mb-4"
              style={{ display: "flex", marginTop: "22px" }}
              controlId="name.ControlInput1"
            >
              <Form.Label>
                {" "}
                <img src={circle_icon} style={{ marginBottom: "12px" }} />
              </Form.Label>
              <Form.Control type="text" ref={name} placeholder="이름" />
            </Form.Group>
            <Form.Group controlId="contractYn.ControlCheckbox1">
              <Form.Check
                type="checkbox"
                label="계약 체결 여부"
                checked={contractYn} // 체크박스 상태를 반영
                onChange={handleContractYnChange} // 체크박스 상태 변경 핸들러
                style={{
                  marginLeft: "14px",
                  marginBottom: "10px",
                  marginTop: "-20px",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-0">
              <img src={circle_icon} style={{ marginBottom: "20px" }} />
              <ButtonGroup>
                <div
                  className="Modal_customerType"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "16px",
                    paddingRight: "9px",
                    paddingLeft: "9px",
                    marginRight: "10px",
                    borderWidth: "1px",
                    borderRadius: "5px",
                    borderStyle: "solid",
                    borderColor: "#DEE2E5", //  테두리 색 적용
                    backgroundColor: "transparent", // 배경을 투명하게 설정
                    color: "#585C5E", // 글자색을 설정
                    // backgroundImage: `url(${circle_icon})`,
                    // backgroundRepeat: "no-repeat",
                    // backgroundPosition: "left top",
                  }}
                >
                  고객유형
                </div>
                {customerTypes.map((type, idx) => (
                  <ToggleButton
                    key={idx}
                    className="Modal_customerType_item"
                    type="button"
                    variant={
                      selectedCustomerType === type
                        ? "primary"
                        : "outline-primary"
                    }
                    ref={customerType}
                    value={selectedCustomerType}
                    style={{ borderRadius: "0px", fontSize: "14px" }}
                    onClick={() => handleCustomerTypeClick(type)}
                    // style={{borderRadius: "5px 0 0 5px",}}
                  >
                    {type}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </Form.Group>
            <Form.Group
              className="mb-0"
              style={{ display: "flex", marginTop: "22px" }}
              controlId="example.ControlInput1"
            >
              <Form.Label>
                <img src={circle_icon} style={{ marginBottom: "12px" }} />
              </Form.Label>
              <Form.Control
                // style={{
                //   backgroundImage: `url(${circle_icon})`,
                //   backgroundRepeat: "no-repeat",
                //   backgroundPosition: "left top",
                // }}
                type="registerDate"
                ref={registerDate}
                placeholder="DB분배일 | 2023.00.00"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-0"
              style={{ display: "flex", marginTop: "22px" }}
              controlId="example.ControlInput1"
            >
              <Form.Label>
                <img src={circle_icon} style={{ marginBottom: "12px" }} />
              </Form.Label>
              <Form.Control
                type="birth"
                ref={birth}
                placeholder="생년월일 | 1900.00.00"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-0"
              style={{ display: "flex", marginTop: "22px" }}
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>
                {" "}
                <img src={circle_icon} style={{ marginBottom: "12px" }} />
              </Form.Label>
              <Form.Control
                type="phoneNumber"
                ref={phone}
                onChange={handlePhoneInputChange}
                placeholder="연락처 | 010-0000-0000"
                autoFocus
              />
            </Form.Group>
            <Row>
              {/* Sido Dropdown */}
              <Col>
                <Form.Group
                  className="mb-0"
                  style={{ display: "flex", marginTop: "22px" }}
                  controlId="sidoSelect"
                >
                  <Form.Label>
                    {" "}
                    <img src={circle_icon} style={{ marginBottom: "12px" }} />
                  </Form.Label>
                  <Form.Select
                    value={selectedSido}
                    onChange={(e) => setSelectedSido(e.target.value)}
                  >
                    <option className="form-group required" value="">
                      시/도 선택
                      {/* <span
                        className="last-letter"
                        style={{ color: "red", backgroundColor: "red" }}
                      >
                        ㅇ*
                      </span> */}
                    </option>

                    {sido.map((el) => (
                      <option key={el.sido} value={el.sido}>
                        {el.codeNm}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Sigugun Dropdown */}
              <Col>
                <Form.Group
                  className="mb-0"
                  style={{ display: "flex", marginTop: "22px" }}
                  controlId="sigugunSelect"
                >
                  <Form.Label>
                    {" "}
                    <img src={circle_icon} style={{ marginBottom: "12px" }} />
                  </Form.Label>
                  <Form.Select
                    value={selectedSigugun}
                    onChange={(e) => setSelectedSigugun(e.target.value)}
                    disabled={!selectedSido}
                  >
                    <option value="">구/군 선택</option>
                    {sigugun
                      .filter((el) => el.sido === selectedSido)
                      .map((el) => (
                        <option key={el.sigugun} value={el.sigugun}>
                          {el.codeNm}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Dong Dropdown */}
              <Col>
                <Form.Group
                  className="mb-0"
                  style={{ display: "flex", marginTop: "22px" }}
                  controlId="dongSelect"
                >
                  <Form.Label></Form.Label>
                  <Form.Select
                    value={selectedDong}
                    onChange={(e) => setSelectedDong(e.target.value)}
                    disabled={!selectedSigugun}
                  >
                    <option value="">동 선택</option>
                    {dong
                      .filter(
                        (el) =>
                          el.sido === selectedSido &&
                          el.sigugun === selectedSigugun
                      )
                      .map((el) => (
                        <option key={el.dong} value={el.dong}>
                          {el.codeNm}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-0" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="address"
                ref={address}
                placeholder="도로명 주소 | 지번 주소 입력하기"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-0"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label></Form.Label>
              <Form.Control
                type="state"
                ref={state}
                placeholder="인수상태 | 상담중, 전산완료, 가입불가 등"
                as="textarea"
                rows={1}
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
                placeholder="특이사항 | 월 보험료 00만원/본인점검/주말상담희망 등"
                as="textarea"
                rows={2}
              />
            </Form.Group>
            <Modal.Footer style={{ marginRight: "-12px" }}>
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
