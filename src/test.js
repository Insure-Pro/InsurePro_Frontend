import axios from "axios";
import { useRef, useState, useEffect } from "react";
import "../../App.css";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import hangjungdong from "./hangjungdong";
import Swal from "sweetalert2";
import CustomerTypeButtons from "../Button/CustomerTypeButtons";

function Modal1({ show, onModalClose }) {
  const modalRef = useRef(); // Reference to the modal

  const handleClose = (event) => {
    // Check if the click is outside the modal content
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      // resetStates(); // 상태 초기화 함수
      onModalClose();
    }
  };

  // const resetStates = () => {
  //   // 모달을 닫을 때 입력 필드의 state 초기화
  //   setNameInput("");
  //   setAgeInput("");
  //   setAddressInput("");
  //   setBirthInput("");
  //   setRegisterDateInput("");
  //   setPhoneInput("");
  //   setStateInput("");
  //   setMemoInput("");
  //   setSelectedCustomerType("");
  //   setSelectedSido("");
  //   setSelectedSigugun("");
  //   setSelectedDong("");
  // };

  //모달창 외부 클릭 시 닫힘
  useEffect(() => {
    // Add event listener to document
    document.addEventListener("mousedown", handleClose);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  // const customerType = useRef("");s
  const name = useRef("");
  const age = useRef("");
  const birth = useRef("");
  const registerDate = useRef("");
  const address = useRef("");
  const phone = useRef("");
  const memo = useRef("");
  const state = useRef("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCustomerType, setSelectedCustomerType] = useState({
    name: "",
    pk: null,
  });
  const [contractYn, setContractYn] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [modalHeight, setModalHeight] = useState("600px");

  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigugun, setSelectedSigugun] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const { sido, sigugun, dong } = hangjungdong;

  // State를 추가하여 입력 필드의 값을 추적합니다.
  // const [nameInput, setNameInput] = useState("");
  // const [ageInput, setAgeInput] = useState("");
  // const [addressInput, setAddressInput] = useState("");
  // const [birthInput, setBirthInput] = useState("");
  // const [registerDateInput, setRegisterDateInput] = useState("");
  // const [phoneInput, setPhoneInput] = useState("");
  // const [stateInput, setStateInput] = useState("");
  // const [memoInput, setMemoInput] = useState("");

  // 입력 필드에 대한 이벤트 핸들러를 구현합니다.

  // const handleNameInputChange = (e) => {
  //   setNameInput(e.target.value);
  // };
  // const handleAgeInputChange = (e) => {
  //   setAgeInput(e.target.value);
  // };
  // const handleAddressInputChange = (e) => {
  //   setAddressInput(e.target.value);
  // };
  // const handleBirthInputChange = (e) => {
  //   setBirthInput(e.target.value);
  // };
  // const handleRegisterDateInputChange = (e) => {
  //   setRegisterDateInput(e.target.value);
  // };
  // const handleMemoInputChange = (e) => {
  //   setMemoInput(e.target.value);
  // };
  // const handleStateInputChange = (e) => {
  //   setStateInput(e.target.value);
  // };

  // console.log(fullAddress);
  const handleContractYnChange = () => {
    // 체크박스 상태를 토글
    setContractYn(!contractYn);
  };

  // 고객 유형 버튼 클릭 핸들러
  const handleCustomerTypeClick = (typeObj) => {
    if (selectedCustomerType.pk === typeObj.pk) {
      setSelectedCustomerType({ name: "", pk: null }); // Reset to initial state
    } else {
      setSelectedCustomerType(typeObj); // Update with the new type object
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
  };

  const close_icon = process.env.PUBLIC_URL + "/Close.png";
  const circle_icon_middle = process.env.PUBLIC_URL + "/circle-14-4.png";
  // 전화번호 형식을 검증하는 함수
  const isValidPhoneNumber = (phoneNumber) => {
    // 전화번호 형식: '010-xxxx-xxxx', '010xxxxxxx', '010.xxx.xxxx.xxxx' 등을 허용
    const regex =
      /^01[0-9]-?([0-9]{4})-?([0-9]{4})$|^01[0-9]\.?([0-9]{4})\.?([0-9]{4})$/;
    return regex.test(phoneNumber);
  };
  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    // 에러 메시지 및 모달 높이 초기화
    setErrorMessage("");
    setModalHeight("600px");
    // 필수 입력 사항 검사
    // if (!selectedCustomerType) {
    //   setErrorMessage("고객유형이 선택되지 않았습니다.");
    //   setModalHeight("630px");
    //   return;
    // } else if (!nameInput) {
    //   setErrorMessage("고객이름이 입력되지 않았습니다.");
    //   setModalHeight("630px");
    //   return;
    // } else if (!phoneInput) {
    //   setErrorMessage("전화번호가 입력되지 않았습니다.");
    //   setModalHeight("630px");
    //   return;
    // } else if (!selectedCustomerType && !nameInput && !phoneInput) {
    //   setErrorMessage("필수입력사항을 입력해주세요.");
    //   setModalHeight("630px");
    // } else if (!isValidPhoneNumber(phoneInput)) {
    //   setErrorMessage("올바른 전화번호 형식이 아닙니다.");
    //   setModalHeight("630px");
    // } else {
    //   setErrorMessage(""); // 에러 메시지 초기화
    // }

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

    const customerTypes = {
      pk: selectedCustomerType.pk,
      // name: selectedCustomerType.name,
    };
    const birthValue = birth.current.value.replace(/[./]/g, "-");
    const registerDateValue = registerDate.current.value.replace(/[./]/g, "-");
    const ageValue = calculateKoreanAge(birthValue);
    const phoneSend = phoneNumber || phone.current.value;
    // phone.current = phone.current; // phone Ref를 업데이트하지 않음
    const data = {
      customerTypePk: selectedCustomerType.pk,
      name: name.current.value,
      birth: birthValue,
      registerDate: registerDateValue,
      age: age.current.value,
      address: address.current.value,
      phone: phoneSend,
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
          Swal.fire({
            html:
              "<div style='text-align: left; font-size:16px;'>" +
              "신규고객 등록이 완료되었습니다..<br><br>" +
              "</div>",
            timer: 3500,
            showConfirmButton: false,
            timerProgressBar: true,
            position: "top", // Position the alert near the top of the screen
          });
          // resetStates(); // 입력 상태 초기화
          onModalClose();
        }
      })

      .catch((error) => {
        if (error.response && error.response.status === 500) {
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
      <div
        className="modal-style "
        show={show}
        style={{ height: modalHeight }} // 모달 높이 동적 조절
      >
        <div className="h-8 rounded-t-md  bg-LightMode-SectionBackground px-7 py-[7px] text-sm font-normal">
          <div class="flex cursor-default justify-between font-normal text-LightMode-Text">
            <div>신규고객 추가 </div>
            <img
              class="cursor-pointer"
              onClick={handleClose}
              src={close_icon}
            />
          </div>
        </div>
        <div class="mb-[15px]  mr-[18px] mt-2 flex justify-end pb-2">
          <img
            src={circle_icon_middle}
            style={{ width: "12px", height: "12px", marginTop: "2px" }}
          />
          <span class="cursor-default text-[12px]">필수입력사항</span>
        </div>
        <div
          ref={modalRef}
          class="my-[-15px]"
          // style={{ margin: "-15px 0px" }}
        >
          <form onSubmit={handleSubmit} className=" h-full w-full  pl-6">
            <div className="mb-1  h-12 w-[352px] ">
              <div class=" flex items-center">
                <div className="w-[84px] cursor-default pb-4">
                  {" "}
                  <span className="Highlighting">*</span>고객유형
                </div>
                <div className="mb-4">
                  <CustomerTypeButtons
                    selectedCustomerType={selectedCustomerType}
                    handleCustomerTypeClick={handleCustomerTypeClick}
                  />
                </div>
              </div>
            </div>
            <div class=" modal_item_container">
              <div class="w-[84px] cursor-default pr-5">
                <span className="Highlighting">*</span>
                이름
              </div>
              <input
                class={`modal_item_input  
                pl-16`}
                // ${
                //   nameInput ? "border-primary-100" : "border-gray-300"
                // }
                type="text"
                ref={name}
                // value={nameInput}
                // onChange={handleNameInputChange}
              />
            </div>
            <div class="mb-0.5 flex items-center text-xs text-Secondary-100">
              <input
                type="checkbox"
                id="customCheckbox"
                className="hidden-checkbox"
                checked={contractYn} // 체크박스 상태를 반영
                onChange={handleContractYnChange} // 체크박스 상태 변경 핸들러
              />
              <label
                htmlFor="customCheckbox"
                class={`checkbox-label_14 ml-[84px] mr-1 ${
                  contractYn ? "text-Primary-400" : "text-Secondary-100"
                }`}
              ></label>
              <span
                class={`${
                  contractYn ? "text-Primary-400" : "text-Secondary-100"
                }`}
              >
                {contractYn ? "계약완료 고객" : "계약 미완료"}
              </span>
            </div>
            <div class=" modal_item_container">
              <div class="w-[84px] cursor-default pl-1">나이 (만)</div>
              <input
                class={` modal_item_input 
                pl-[82px]`}
                // ${
                //   ageInput ? "border-primary-100" : "border-gray-300"
                // }
                type="number"
                ref={age}
                // value={ageInput}
                // onChange={handleAgeInputChange}
              />
            </div>
            <div className="flex items-center  ">
              <div class=" flex h-[40px] w-[76px] cursor-default items-center pl-5 ">
                주소
              </div>
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
            </div>
            <div class="mb-2 flex items-center">
              <input
                className={` modal_item_input  
                ml-[84px] px-3 `}
                // ${
                //   addressInput ? "border-primary-100" : "border-gray-300"
                // }
                type="text"
                ref={address}
                // value={addressInput}
                // onChange={handleAddressInputChange}
                placeholder="상세 주소 입력"
              />
            </div>
            <div class="modal_item_container mb-1">
              <div class="w-[84px] cursor-default">
                <span className="Highlighting">*</span>
                DB 분배일
              </div>
              <input
                type="date"
                ref={registerDate}
                class={` modal_item_input 
                pl-[52px]`}
                //   ${
                //    registerDateInput
                //      ? "border-primary-100"
                //      : "border-gray-300 text-gray-300"
                //  }
                // value={registerDateInput}
                // onChange={handleRegisterDateInputChange}
                placeholder=" 2023.00.00"
              />
            </div>
            <div class="modal_item_container mb-1">
              <div class="w-[84px] cursor-default pl-2">생년월일</div>
              <input
                class={`modal_item_input  
                pl-[52px] `}
                // ${
                //   birthInput
                //     ? "border-primary-100"
                //     : "border-gray-300 text-gray-300"
                // }
                type="date"
                ref={birth}
                // value={birthInput}
                // onChange={handleBirthInputChange}
                placeholder=" 1900.00.00"
              />
            </div>
            <div class="modal_item_container mb-1">
              <div class="w-[84px] cursor-default ">
                <span className="Highlighting">*</span>전화번호
              </div>
              <input
                class={` modal_item_input 
                px-3 text-center`}
                // ${
                //   phoneInput ? "border-primary-100 " : "border-gray-300 "
                // }
                type="text"
                ref={phone}
                // value={phoneInput}
                onChange={handlePhoneInputChange}
                placeholder="01012345678"
              />
            </div>
            <div class="modal_item_container mb-2">
              <div class="w-[84px] cursor-default pl-2">인수상태</div>
              <input
                type="state"
                class={`modal_item_input
                px-3`}
                //   ${
                //    stateInput ? "border-primary-100" : "border-gray-300"
                //  }
                ref={state}
                // value={stateInput}
                // onChange={handleStateInputChange}
                placeholder=" 상담중, 전산완료, 가입불가 "
                as="textarea"
                rows={1}
              />
            </div>
            <div class=" flex h-[68px] w-[352px] ">
              <div class="w-[84px] cursor-default pl-2 pt-1.5">특이사항</div>
              <textarea
                class={`modal_item_input_memo  
                px-3 pt-2`}
                // ${
                //   memoInput ? "border-primary-100" : "border-gray-300"
                // }
                ref={memo}
                // value={memoInput}
                // onChange={handleMemoInputChange}
                placeholder=" 월 보험료 00만원/본인점검"
                rows={3}
              />
            </div>

            <div>
              {errorMessage && (
                <div className="mb-[14px] text-center text-xs font-bold text-Danger-600">
                  {errorMessage}
                </div>
              )}
              <button
                class="flex h-[40px] w-[280px] items-center justify-center rounded border border-primary-100 py-2 text-[17px] font-semibold text-primary-100 hover:bg-primary-100 hover:text-white"
                type="submit"
              >
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Modal1;
