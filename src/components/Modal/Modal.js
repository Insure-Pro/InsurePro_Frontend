import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { Row, Col } from "react-bootstrap";

function Modal1({ onModalClose }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
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

  const areaData = {
    area0: [
      "시/도 선택",
      "서울특별시",
      "인천광역시",
      "대전광역시",
      "광주광역시",
      "대구광역시",
      "울산광역시",
      "부산광역시",
      "경기도",
      "강원도",
      "충청북도",
      "충청남도",
      "전라북도",
      "전라남도",
      "경상북도",
      "경상남도",
      "제주도",
    ],
    area1: [
      "강남구",
      "강동구",
      "강북구",
      "강서구",
      "관악구",
      "광진구",
      "구로구",
      "금천구",
      "노원구",
      "도봉구",
      "동대문구",
      "동작구",
      "마포구",
      "서대문구",
      "서초구",
      "성동구",
      "성북구",
      "송파구",
      "양천구",
      "영등포구",
      "용산구",
      "은평구",
      "종로구",
      "중구",
      "중랑구",
    ],
    area2: [
      "계양구",
      "남구",
      "남동구",
      "동구",
      "부평구",
      "서구",
      "연수구",
      "중구",
      "강화군",
      "옹진군",
    ],
    area3: ["대덕구", "동구", "서구", "유성구", "중구"],
    area4: ["광산구", "남구", "동구", "북구", "서구"],
    area5: [
      "남구",
      "달서구",
      "동구",
      "북구",
      "서구",
      "수성구",
      "중구",
      "달성군",
    ],
    area6: ["남구", "동구", "북구", "중구", "울주군"],
    area7: [
      "부산진구",
      "동구",
      "서구",
      "남구",
      "북구",
      "중구",
      "금정구",
      "동래구",
      "사상구",
      "사하구",
      "수영구",
      "연제구",
      "영도구",
      "해운대구",
      "강서구",
      "기장군",
    ],
    area8: [
      "고양시",
      "과천시",
      "광명시",
      "광주시",
      "구리시",
      "군포시",
      "김포시",
      "남양주시",
      "동두천시",
      "부천시",
      "성남시",
      "수원시",
      "시흥시",
      "안산시",
      "안성시",
      "안양시",
      "양주시",
      "오산시",
      "용인시",
      "의왕시",
      "의정부시",
      "이천시",
      "파주시",
      "평택시",
      "포천시",
      "하남시",
      "화성시",
      "가평군",
      "양평군",
      "여주군",
      "연천군",
    ],
    area9: [
      "강릉시",
      "동해시",
      "삼척시",
      "속초시",
      "원주시",
      "춘천시",
      "태백시",
      "고성군",
      "양구군",
      "양양군",
      "영월군",
      "인제군",
      "정선군",
      "철원군",
      "평창군",
      "홍천군",
      "화천군",
      "횡성군",
    ],
    area10: [
      "제천시",
      "청주시",
      "충주시",
      "괴산군",
      "단양군",
      "보은군",
      "영동군",
      "옥천군",
      "음성군",
      "증평군",
      "진천군",
      "청원군",
    ],
    area11: [
      "계룡시",
      "공주시",
      "논산시",
      "보령시",
      "서산시",
      "아산시",
      "천안시",
      "금산군",
      "당진군",
      "부여군",
      "서천군",
      "연기군",
      "예산군",
      "청양군",
      "태안군",
      "홍성군",
    ],
    area12: [
      "군산시",
      "김제시",
      "남원시",
      "익산시",
      "전주시",
      "정읍시",
      "고창군",
      "무주군",
      "부안군",
      "순창군",
      "완주군",
      "임실군",
      "장수군",
      "진안군",
    ],
    area13: [
      "광양시",
      "나주시",
      "목포시",
      "순천시",
      "여수시",
      "강진군",
      "고흥군",
      "곡성군",
      "구례군",
      "담양군",
      "무안군",
      "보성군",
      "신안군",
      "영광군",
      "영암군",
      "완도군",
      "장성군",
      "장흥군",
      "진도군",
      "함평군",
      "해남군",
      "화순군",
    ],
    area14: [
      "경산시",
      "경주시",
      "구미시",
      "김천시",
      "문경시",
      "상주시",
      "안동시",
      "영주시",
      "영천시",
      "포항시",
      "고령군",
      "군위군",
      "봉화군",
      "성주군",
      "영덕군",
      "영양군",
      "예천군",
      "울릉군",
      "울진군",
      "의성군",
      "청도군",
      "청송군",
      "칠곡군",
    ],
    area15: [
      "거제시",
      "김해시",
      "마산시",
      "밀양시",
      "사천시",
      "양산시",
      "진주시",
      "진해시",
      "창원시",
      "통영시",
      "거창군",
      "고성군",
      "남해군",
      "산청군",
      "의령군",
      "창녕군",
      "하동군",
      "함안군",
      "함양군",
      "합천군",
    ],
    area16: ["서귀포시", "제주시", "남제주군", "북제주군"],
  };

  // 상태 관리
  const [selectedSido, setSelectedSido] = useState("부산광역시");
  const [gugunOptions, setGugunOptions] = useState(areaData["area7"]);
  const [selectedGugun, setSelectedGugun] = useState("");
  const [fullAddress, setFullAddress] = useState(
    `${selectedSido} ${gugunOptions[0] || ""}`
  );

  // 시/도 선택 핸들러
  const handleSidoChange = (event) => {
    const newSido = event.target.value;
    setSelectedSido(newSido);

    // 구/군 데이터 업데이트
    const areaKey = "area" + areaData.area0.indexOf(newSido);
    setGugunOptions(areaData[areaKey] || []);

    // 주소 업데이트 (구/군 초기화)
    setFullAddress(newSido);
    setSelectedGugun("");
  };

  // 구/군 선택 핸들러
  const handleGugunChange = (event) => {
    const newGugun = event.target.value;
    setSelectedGugun(newGugun);

    // 전체 주소 업데이트
    setFullAddress(selectedSido + " " + newGugun);
  };
  console.log(fullAddress);
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

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!customerType.current) {
      alert("고객유형을 선택해주세요.");
      return;
    }

    console.log("Updated fullAddress:", fullAddress);
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
      lipk: fullAddress,
    };

    axios
      .post("https://www.insurepro.kro.kr/v1/customer", data, {
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
        <Modal.Header closeButton>
          <Modal.Title>신규고객 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body className="Modal_container" style={{ margin: "-15px 0px" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="name.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control type="text" ref={name} placeholder="이름" />
            </Form.Group>
            <Form.Group controlId="contractYn.ControlCheckbox1">
              <Form.Check
                type="checkbox"
                label="계약 체결 여부"
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
                    ref={customerType}
                    value={selectedCustomerType}
                    style={{ borderRadius: "0px" }}
                    onClick={() => handleCustomerTypeClick(type)}
                    // style={{borderRadius: "5px 0 0 5px",}}
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
                ref={registerDate}
                placeholder="DB분배일 | 2023.00.00"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="example.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="birth"
                ref={birth}
                placeholder="생년월일 | 1900.00.00"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                type="phoneNumber"
                ref={phone}
                onChange={handlePhoneInputChange}
                placeholder="연락처 | 010-0000-0000"
                autoFocus
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group
                  className="mb-0"
                  controlId="exampleForm.ControlSelect1"
                >
                  <Form.Label></Form.Label>
                  <Form.Select onChange={handleSidoChange} value={selectedSido}>
                    {areaData.area0.map((sido) => (
                      <option key={sido} value={sido}>
                        {sido}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  className="mb-0"
                  controlId="exampleForm.ControlSelect2"
                >
                  <Form.Label></Form.Label>
                  <Form.Select
                    onChange={handleGugunChange}
                    value={selectedGugun}
                    disabled={!selectedSido || selectedSido === "시/도 선택"}
                  >
                    {gugunOptions.map((gugun) => (
                      <option key={gugun} value={gugun}>
                        {gugun}
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
                placeholder="주소입력"
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
