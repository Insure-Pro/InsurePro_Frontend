import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import PropTypes from "prop-types";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { Row, Col } from "react-bootstrap";
import hangjungdong from "./hangjungdong";

const EditModalD = ({
  onClose,
  show,
  onHide,
  selectedCustomer,
  onUpdateSuccess,
}) => {
  const nameRef = useRef("");
  const registerDateRef = useRef("");
  const birthRef = useRef("");
  const phoneRef = useRef("");
  const addressRef = useRef("");
  const stateRef = useRef("");
  const memoRef = useRef("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();
  // 선택된 고객 유형을 나타내는 state
  const [selectedCustomerType, setSelectedCustomerType] = useState("");
  const [contractYn, setContractYn] = useState(false);

  EditModalD.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    selectedCustomer: PropTypes.object.isRequired,
    onUpdateSuccess: PropTypes.func.isRequired,
  };

  // useEffect that updates state only when selectedCustomer changes
  useEffect(() => {
    if (selectedCustomer) {
      // console.log("EditModalD - selectedCustomer:", selectedCustomer);
      setSelectedCustomerType(selectedCustomer?.customerType || "");
      setContractYn(selectedCustomer?.contractYn || false);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedCustomer && selectedCustomer.metroGuDong) {
      // 이름을 식별자로 변환
      const sidoId =
        hangjungdong.sido.find(
          (el) => el.codeNm === selectedCustomer.metroGuDong.metroName
        )?.sido || "";
      const sigugunId =
        hangjungdong.sigugun.find(
          (el) =>
            el.codeNm === selectedCustomer.metroGuDong.guName &&
            el.sido === sidoId
        )?.sigugun || "";
      const dongId =
        hangjungdong.dong.find(
          (el) =>
            el.codeNm === selectedCustomer.metroGuDong.dongName &&
            el.sido === sidoId &&
            el.sigugun === sigugunId
        )?.dong || "";

      // 상태 업데이트
      setSelectedSido(sidoId);
      setSelectedSigugun(sigugunId);
      setSelectedDong(dongId);
    }
  }, [selectedCustomer, hangjungdong]);

  const customerTypes = ["OD", "AD", "CP", "CD", "JD", "H", "X", "Y", "Z"];

  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigugun, setSelectedSigugun] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const { sido, sigugun, dong } = hangjungdong;

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const handleContractYnChange = () => {
    // 체크박스 상태를 토글
    setContractYn(!contractYn);
  };

  // 고객 유형 버튼 클릭 핸들러
  const handleCustomerTypeClick = (type) => {
    // console.log("Clicked button:", type);
    // console.log("Selected customer type before:", selectedCustomerType);
    // 이미 선택된 유형을 다시 클릭하면 선택 해제
    if (selectedCustomerType === type) {
      setSelectedCustomerType("");
    } else {
      setSelectedCustomerType(type);
    }

    // console.log("Selected customer type after:", selectedCustomerType);
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

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const birthValue = birthRef.current.value.replace(/[./]/g, "-");
    const registerDateValue = registerDateRef.current.value.replace(
      /[./]/g,
      "-"
    );
    const ageValue = calculateKoreanAge(birthValue);
    const phoneSend = phoneNumber || phoneRef.current.value;

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

    try {
      const updatedData = {
        name: nameRef.current.value,
        birth: birthRef.current.value,
        phone: phoneSend,
        age: ageValue,
        address: addressRef.current.value,
        state: stateRef.current.value,
        memo: memoRef.current.value,
        contractYn: contractYn,
        customerType: selectedCustomerType,
        registerDate: registerDateValue,
        metroGuDong: metroGuDong,
      };
      const response = await axios.patch(
        `${MAIN_URL}/customer/${selectedCustomer.pk}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      // Assuming response.data contains the updated customer data
      const updatedCustomer = response.data;
      // 데이터 업데이트 후 Main.js의 fetchData 함수를 호출하기 위해 onClose를 실행
      if (response.status === 200) {
        // Check if onUpdateSuccess is defined and is a function
        if (onUpdateSuccess && typeof onUpdateSuccess === "function") {
          onUpdateSuccess(updatedCustomer);
        } else {
          console.error(
            "onUpdateSuccess is not defined or not a function. Got:",
            onUpdateSuccess
          );
        }

        // console.log(updatedData);
        // Handle success: close the modal, refresh data, etc.
        onHide();
      } // Close the modal
    } catch (error) {
      // Handle error: display error message, etc.
      console.error("Error updating customer:", error);
    }
  };
  console.log(selectedSido);
  console.log(selectedSigugun);
  console.log(selectedDong);
  return (
    <>
      <Modal show={show} onHide={onHide} style={{ marginTop: "60px" }}>
        <Modal.Header closeButton style={{ marginRight: "16px" }}>
          <Modal.Title>고객정보 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body className="Modal_container" style={{ margin: "-15px 0px" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formName">
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                placeholder="이름"
                defaultValue={selectedCustomer?.name}
                ref={nameRef}
              />
            </Form.Group>
            <Form.Group controlId="contractYn.ControlCheckbox1">
              <Form.Check
                type="checkbox"
                label="계약 체결 여부"
                // defaultValue={selectedCustomer?.contractYn}
                checked={contractYn} // 체크박스 상태를 반영
                onChange={handleContractYnChange} // 체크박스 상태 변경 핸들러
                style={{
                  marginLeft: "2px",
                  marginBottom: "10px",
                  marginTop: "-20px",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-0">
              <ButtonGroup>
                <div
                  className="Modal_customerType"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingRight: "9px",
                    paddingLeft: "9px",
                    marginRight: "10px",
                    borderWidth: "1px",
                    borderRadius: "5px",
                    borderStyle: "solid",
                    borderColor: "#DEE2E5", //  테두리 색 적용
                    backgroundColor: "transparent", // 배경을 투명하게 설정
                    color: "#585C5E", // 글자색을 설정
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
                    value={selectedCustomerType}
                    style={{ borderRadius: "0px" }}
                    onClick={() => handleCustomerTypeClick(type)}
                  >
                    {type}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </Form.Group>
            <Form.Group className="mb-0" controlId="example.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="registerDate"
                placeholder="DB분배일 | 2023.00.00"
                defaultValue={selectedCustomer?.registerDate}
                ref={registerDateRef}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="example.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="birth"
                placeholder="생년월일 | 1900.00.00"
                defaultValue={selectedCustomer?.birth}
                ref={birthRef}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="phoneNumber"
                placeholder="연락처 | 010-0000-0000"
                defaultValue={selectedCustomer?.phone}
                onChange={handlePhoneInputChange}
                ref={phoneRef}
                autoFocus
              />
            </Form.Group>
            <Row>
              {/* Sido Dropdown */}
              <Col>
                <Form.Group className="mb-0" controlId="sidoSelect">
                  <Form.Label></Form.Label>
                  <Form.Select
                    value={selectedSido}
                    onChange={(e) => setSelectedSido(e.target.value)}
                  >
                    <option value="">시/도 선택</option>
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
                <Form.Group className="mb-0" controlId="sigugunSelect">
                  <Form.Label></Form.Label>
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
                <Form.Group className="mb-0" controlId="dongSelect">
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
                placeholder="도로명 주소 | 지번 주소 입력하기"
                defaultValue={selectedCustomer?.address}
                ref={addressRef}
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-0"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label></Form.Label>
              <Form.Control
                type="stete"
                placeholder="인수상태 | 상담중, 전산완료, 가입불가 등"
                defaultValue={selectedCustomer?.state}
                ref={stateRef}
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
                placeholder="특이사항 | 월 보험료 00만원/본인점검/주말상담희망 등"
                defaultValue={selectedCustomer?.memo}
                ref={memoRef}
                as="textarea"
                rows={2}
              />
            </Form.Group>
            <Modal.Footer style={{ marginRight: "-12px" }}>
              {/* <Button variant="secondary" onClick={handleClose}>
                취소
              </Button> */}
              <Button variant="primary" type="submit">
                변경사항 저장
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditModalD;
