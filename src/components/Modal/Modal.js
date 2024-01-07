import axios from "axios";
import { useRef, useState, useEffect } from "react";
import "../../App.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { Row, Col } from "react-bootstrap";
import hangjungdong from "./hangjungdong";

function Modal1({ show, onModalOpen, onModalClose }) {
  // const [show, setShow] = useState(false);

  const modalRef = useRef(); // Reference to the modal

  const handleClose = (event) => {
    // Check if the click is outside the modal content
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      resetStates(); // 상태 초기화 함수
      onModalClose();
      // setShow(false);
    }
  };

  const resetStates = () => {
    // 모달을 닫을 때 입력 필드의 state 초기화
    setNameInput("");
    setAgeInput("");
    setAddressInput("");
    setBirthInput("");
    setRegisterDateInput("");
    setPhoneInput("");
    setStateInput("");
    setMemoInput("");
    setSelectedCustomerType("");
    setSelectedSido("");
    setSelectedSigugun("");
    setSelectedDong("");
  };

  const handleShow = () => {
    onModalOpen();
    // setShow(true);
  };
  useEffect(() => {
    // Add event listener to document
    document.addEventListener("mousedown", handleClose);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  const customerType = useRef("");
  const name = useRef("");
  const age = useRef("");
  const birth = useRef("");
  const registerDate = useRef("");
  const address = useRef("");
  const phone = useRef("");
  const memo = useRef("");
  const state = useRef("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedCustomerType, setSelectedCustomerType] = useState("");
  const [contractYn, setContractYn] = useState(false);

  const customerTypeColors = {
    OD: "var(--color-1)",
    AD: "var(--color-2)",
    CP: "var(--color-3)",
    CD: "var(--color-4)",
    JD: "var(--color-5)",
    H: "var(--color-6)",
    X: "var(--color-7)",
    Y: "var(--color-8)",
    Z: "var(--color-9)",
  };
  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigugun, setSelectedSigugun] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const { sido, sigugun, dong } = hangjungdong;

  // State를 추가하여 입력 필드의 값을 추적합니다.
  const [nameInput, setNameInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [birthInput, setBirthInput] = useState("");
  const [registerDateInput, setRegisterDateInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [memoInput, setMemoInput] = useState("");

  // 입력 필드에 대한 이벤트 핸들러를 구현합니다.

  const handleNameInputChange = (e) => {
    setNameInput(e.target.value);
  };
  const handleAgeInputChange = (e) => {
    setAgeInput(e.target.value);
  };
  const handleAddressInputChange = (e) => {
    setAddressInput(e.target.value);
  };
  const handleBirthInputChange = (e) => {
    setBirthInput(e.target.value);
  };
  const handleRegisterDateInputChange = (e) => {
    setRegisterDateInput(e.target.value);
  };
  const handleMemoInputChange = (e) => {
    setMemoInput(e.target.value);
  };
  const handleStateInputChange = (e) => {
    setStateInput(e.target.value);
  };

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
    setPhoneInput(event.target.value);
  };

  const close_icon = process.env.PUBLIC_URL + "/Close.png";
  const initial_icon = process.env.PUBLIC_URL + "/initial_icon.png";
  const add_icon = process.env.PUBLIC_URL + "/add_button.png";
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
        (el) => el.sido === selectedSido && el.sigugun === selectedSigugun,
      )?.codeNm || "";

    const dongName =
      hangjungdong.dong.find(
        (el) =>
          el.sido === selectedSido &&
          el.sigugun === selectedSigugun &&
          el.dong === selectedDong,
      )?.codeNm || "";

    const metroGuDong = {
      metroName: metroName,
      guName: guName,
      dongName: dongName,
    };

    const birthValue = birth.current.value.replace(/[./]/g, "-");
    const registerDateValue = registerDate.current.value.replace(/[./]/g, "-");
    const ageValue = calculateKoreanAge(birthValue);
    customerType.current.value = selectedCustomerType;
    phone.current = phone.current; // phone Ref를 업데이트하지 않음
    const data = {
      customerType: selectedCustomerType,
      name: name.current.value,
      birth: birthValue,
      registerDate: registerDateValue,
      age: age.current.value,
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
          // setShow(false);
          // onModalClose(); // 모달이 닫힐 때 새로고침 상태 변경
          resetStates(); // 입력 상태 초기화
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
              },
            )
            .then((tokenResponse) => {
              // 새로 받은 accessToken을 저장하고 원래의 요청을 다시 시도
              localStorage.setItem(
                "accessToken",
                tokenResponse.data.accessToken,
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
      {/* <button
        className="Add_Btn2"
        onClick={handleShow}
        style={{
          width: "20px",
          height: "20px",
          marginLeft: "48px",
          marginRight: "16px",
        }}
      >
        <img src={add_icon} />
      </button> */}

      <Modal
        className="modal-style  "
        show={show}
        onHide={handleClose}
        onExited={onModalClose}
      >
        <div
          className="h-8 rounded-t-md bg-gray-300  px-7 py-[7px] text-sm font-normal"
          style={{ margin: "0px" }}
        >
          <div class="flex justify-between font-normal text-gray-250">
            <div>신규고객 추가 </div>
            <img
              class="cursor-pointer"
              onClick={handleClose}
              src={close_icon}
            />
          </div>
        </div>
        <div
          class="pb-2"
          style={{
            display: "flex",
            margin: "4px 18px 15px 0px",
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
        <div
          className="Modal_container"
          ref={modalRef}
          style={{ margin: "-15px 0px" }}
        >
          <Form onSubmit={handleSubmit}>
            {/* <Form.Group> controlId="contractYn.ControlCheckbox1">
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
            </Form.Group> */}
            <div className="mb-1  h-12 w-[352px] ">
              <div class=" flex items-center">
                <div className="w-[84px] ">
                  {" "}
                  <span className="Highlighting">*</span>고객유형
                </div>
                <div class="flex h-12 w-52 items-center  overflow-x-scroll whitespace-nowrap  ">
                  {Object.keys(customerTypeColors).map((type, idx) => (
                    <button
                      key={idx}
                      className=" flex h-7 w-12 items-center border border-gray-300 px-[14px] py-[5px] outline-none"
                      type="button"
                      style={{
                        color:
                          selectedCustomerType === type
                            ? customerTypeColors[type]
                            : "var(--gray-300)",
                        borderColor:
                          selectedCustomerType === type
                            ? customerTypeColors[type]
                            : "var(--gray-300)",
                      }}
                      ref={customerType}
                      value={selectedCustomerType}
                      onClick={() => handleCustomerTypeClick(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div class=" modal_item_container">
              <div class="w-[84px]">
                <span className="Highlighting">*</span>
                이름
              </div>
              <input
                class={`modal_item_input  ${
                  nameInput ? "border-primary-100" : "border-gray-300"
                } pl-16`}
                type="text"
                ref={name}
                value={nameInput}
                onChange={handleNameInputChange}
              />
            </div>
            <div class=" modal_item_container">
              <div class="w-[84px] pl-2">나이 (만)</div>
              <input
                class={` modal_item_input ${
                  ageInput ? "border-primary-100" : "border-gray-300"
                } pl-[82px]`}
                type="number"
                ref={age}
                value={ageInput}
                onChange={handleAgeInputChange}
              />
            </div>
            <Row className=" flex h-[40px] items-center">
              <div class="w-[75px] pl-2">주소</div>
              <Col>
                <div class="flex" controlId="sidoSelect">
                  <span>
                    {" "}
                    <span className="Highlighting">*</span>
                  </span>
                  <Form.Select
                    className={`modal_address_item ${
                      selectedSido
                        ? "border-primary-100 text-black"
                        : "border-gray-300 text-gray-300"
                    } `}
                    value={selectedSido}
                    onChange={(e) => setSelectedSido(e.target.value)}
                  >
                    <option className="form-group required" value="">
                      시/도
                    </option>

                    {sido.map((el) => (
                      <option key={el.sido} value={el.sido}>
                        {el.codeNm}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Col>
              <Col>
                <div class="flex" controlId="sigugunSelect">
                  <span> </span>
                  <Form.Select
                    className={`modal_address_item ml-1.5 ${
                      selectedSigugun
                        ? "border-primary-100 text-black"
                        : "border-gray-300 text-gray-300"
                    }  `}
                    value={selectedSigugun}
                    onChange={(e) => setSelectedSigugun(e.target.value)}
                    disabled={!selectedSido}
                  >
                    <option value="">구/군</option>
                    {sigugun
                      .filter((el) => el.sido === selectedSido)
                      .map((el) => (
                        <option key={el.sigugun} value={el.sigugun}>
                          {el.codeNm}
                        </option>
                      ))}
                  </Form.Select>
                </div>
              </Col>
              <Col>
                <div class="flex" controlId="dongSelect">
                  <span></span>
                  <Form.Select
                    className={`modal_address_item ml-1.5 ${
                      selectedDong
                        ? "border-primary-100 text-black"
                        : "border-gray-300 text-gray-300"
                    } `}
                    value={selectedDong}
                    onChange={(e) => setSelectedDong(e.target.value)}
                    disabled={!selectedSigugun}
                  >
                    <option value="">동</option>
                    {dong
                      .filter(
                        (el) =>
                          el.sido === selectedSido &&
                          el.sigugun === selectedSigugun,
                      )
                      .map((el) => (
                        <option key={el.dong} value={el.dong}>
                          {el.codeNm}
                        </option>
                      ))}
                  </Form.Select>
                </div>
              </Col>
            </Row>
            <div class="mb-2 flex items-center">
              <input
                className={` modal_item_input  ${
                  addressInput ? "border-primary-100" : "border-gray-300"
                } ml-[84px] px-3 `}
                type="text"
                ref={address}
                value={addressInput}
                onChange={handleAddressInputChange}
                placeholder="상세 주소 입력"
              />
            </div>
            <div class="modal_item_container mb-1">
              <div class="w-[84px]">
                <span className="Highlighting">*</span>
                DB 분배일
              </div>
              <input
                class={` modal_item_input  ${
                  registerDateInput
                    ? "border-primary-100"
                    : "border-gray-300 text-gray-300"
                } pl-[52px]`}
                type="date"
                ref={registerDate}
                // value={registerDateInput}
                onChange={handleRegisterDateInputChange}
                placeholder=" 2023.00.00"
              />
            </div>
            <div class="modal_item_container mb-1">
              <div class="w-[84px] pl-2">생년월일</div>
              <input
                class={`modal_item_input  ${
                  birthInput
                    ? "border-primary-100"
                    : "border-gray-300 text-gray-300"
                } pl-[52px] `}
                type="date"
                ref={birth}
                // value={birthInput}
                onChange={handleBirthInputChange}
                placeholder=" 1900.00.00"
              />
            </div>
            <div class="modal_item_container mb-1">
              <div class="w-[84px] ">
                <span className="Highlighting">*</span>전화번호
              </div>
              <input
                class={` modal_item_input ${
                  phoneInput ? "border-primary-100 " : "border-gray-300 "
                }  px-3`}
                type="text"
                ref={phone}
                // value={phoneInput}
                onChange={handlePhoneInputChange}
                placeholder=" 010-0000-0000"
              />
            </div>
            <div class="modal_item_container mb-2">
              <div class="w-[84px] pl-2">인수상태</div>
              <input
                class={`modal_item_input ${
                  stateInput ? "border-primary-100" : "border-gray-300"
                } px-3`}
                type="state"
                ref={state}
                // value={stateInput}
                onChange={handleStateInputChange}
                placeholder=" 상담중, 전산완료, 가입불가 "
                as="textarea"
                rows={1}
              />
            </div>
            <div class=" flex h-20 w-[352px] ">
              <div class="w-[84px] pl-2">특이사항</div>
              <input
                class={`modal_item_input  ${
                  memoInput ? "border-primary-100" : "border-gray-300"
                } px-3`}
                type="memo"
                ref={memo}
                // value={memoInput}
                onChange={handleMemoInputChange}
                placeholder=" 월 보험료 00만원/본인점검"
                as="textarea"
                rows={3}
              />
            </div>

            <Modal.Footer>
              {/* <Button variant="secondary" onClick={handleClose}>
                취소
              </Button> */}
              <button
                class="flex h-[40px] w-[280px] items-center justify-center rounded border border-primary-100 py-2 text-[17px] font-semibold text-primary-100 hover:bg-primary-100 hover:text-white"
                type="submit"
              >
                등록
              </button>
            </Modal.Footer>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default Modal1;
