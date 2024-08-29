/* global gtag */
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import "../../App.css";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import hangjungdong from "./hangjungdong";
import Swal from "sweetalert2";
import CustomerTypeButtons from "../Button/CustomerTypeButtons";
import { useMediaQuery } from "react-responsive";

function Modal1({ show, onModalClose }) {
  const modalRef = useRef(); // Reference to the modal

  const handleClose = (event) => {
    // Check if the click is outside the modal content
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onModalClose();
    }
  };

  useEffect(() => {
    // Add event listener to document
    document.addEventListener("mousedown", handleClose);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);
  const isMobile = useMediaQuery({ query: "(max-width:700px)" });
  const mobile_modal_top = process.env.PUBLIC_URL + "/Mobile_modal_top.png";

  const name = useRef("");
  const age = useRef("");
  const birth = useRef("");
  const registerDate = useRef("");
  const address = useRef("");
  const phone = useRef("");
  const work = useRef("");
  const worry = useRef("");
  const workTime = useRef("");
  const salary = useRef("");
  const memo = useRef("");
  const state = useRef("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCustomerType, setSelectedCustomerType] = useState({
    name: "",
    pk: null,
  });
  const [contractYn, setContractYn] = useState(false);
  const [gender, setGender] = useState("OTHER");
  const [modalHeight, setModalHeight] = useState("744px");

  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigugun, setSelectedSigugun] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const { sido, sigugun, dong } = hangjungdong;

  const errorMessageRef = useRef(null);

  // 체크박스 상태를 토글
  const handleContractYnChange = () => {
    setContractYn(!contractYn);
  };

  // Gender 버튼 클릭 핸들러
  const handleGenderClick = (selectedGender) => {
    setGender(selectedGender);
  };

  // 고객 유형 버튼 클릭 핸들러
  const handleCustomerTypeClick = (typeObj) => {
    if (selectedCustomerType.pk === typeObj.pk) {
      setSelectedCustomerType({ name: "", pk: null });
    } else {
      setSelectedCustomerType(typeObj);
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

  // 전화번호 형식을 검증하는 함수
  const isValidPhoneNumber = (phoneNumber) => {
    const regex =
      /^01[0-9]-?([0-9]{4})-?([0-9]{4})$|^01[0-9]\.?([0-9]{4})\.?([0-9]{4})$/;
    return regex.test(phoneNumber);
  };

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    // 에러 메시지 및 모달 높이 초기화
    errorMessageRef.current.textContent = "";
    setModalHeight("744px");

    // 필수 입력 사항 검사
    // if (!selectedCustomerType.pk) {
    //   if (errorMessageRef.current) {
    //     errorMessageRef.current.textContent = "고객유형이 선택되지 않았습니다.";
    //   }
    //   setModalHeight("630px");
    //   return;
    // }
    if (!name.current || !name.current.value) {
      if (errorMessageRef.current) {
        errorMessageRef.current.textContent = "고객이름이 입력되지 않았습니다.";
      }
      setModalHeight("774px");
      return;
    } else if (!phone.current || !phone.current.value) {
      if (errorMessageRef.current) {
        errorMessageRef.current.textContent = "전화번호가 입력되지 않았습니다.";
      }
      setModalHeight("774px");
      return;
    } else if (!isValidPhoneNumber(phone.current.value)) {
      if (errorMessageRef.current) {
        errorMessageRef.current.textContent =
          "올바른 전화번호 형식이 아닙니다.";
      }
      setModalHeight("774px");
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
    const phoneSend = phoneNumber || phone.current.value;

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
      work: work.current.value,
      worry: worry.current.value,
      workTime: workTime.current.value,
      salary: salary.current.value,
      // state: state.current.value,
      metroGuDong: metroGuDong,
      gender: gender,
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
            position: "top",
          });
          onModalClose();
          gtag("event", "WM_insurepro_mvp_v1_main_add_customer", {
            event_category: "Main Add Customer",
            event_label: `설계사 PK: test`,
            // event_label: `Customer PK: ${customerPk}`,
            value: 1,
          });
        }
      })
      .catch((error) => {
        if (errorMessageRef.current) {
          errorMessageRef.current.textContent =
            "고객 정보를 업데이트하는 동안 오류가 발생했습니다.";
        }
        if (error.response && error.response.status === 500) {
          axios
            .post(
              /* refreshToken을 사용하여 새 accessToken 요청 URL */ {
                refreshToken: localStorage.getItem("refreshToken"),
              },
            )
            .then((tokenResponse) => {
              localStorage.setItem(
                "accessToken",
                tokenResponse.data.accessToken,
              );
              handleSubmit();
            })
            .catch((tokenError) => {
              console.error("토큰 갱신 실패:", tokenError.message);
            });
        } else {
          console.error("API 요청 에러:", error.message);
        }
      });
  };

  let vh = 0;

  useEffect(() => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  const setVh = () => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight}px`,
    );
  };
  window.addEventListener("resize", setVh);

  setVh();

  return (
    <>
      {isMobile ? (
        <>
          <div
            className="modal-style-mobile flex w-screen  justify-center rounded-t-2xl"
            show={show}
            // style={{ height: modalHeight }}
            style={{
              height: "calc(var(--vh, 1vh) * 100)",
            }}
          >
            <div class="  bottom-0 flex h-[820px] w-screen flex-col items-center overflow-y-scroll  rounded-t-2xl border bg-white">
              <div className="h-20 w-[352px] px-7 py-[7px] text-sm font-normal">
                <div class="mb-5 flex items-center justify-center">
                  <img src={mobile_modal_top} />
                </div>
                <div class="mb-10 flex items-center justify-between font-normal text-LightMode-Text">
                  <div
                    class="cursor-pointer text-sm font-normal text-Danger-300"
                    onClick={handleClose}
                  >
                    취소
                  </div>
                  <div class="text-base font-bold">신규 고객 추가</div>
                  <div
                    class="cursor-pointer text-sm font-normal text-Primary-300"
                    // onClick={handleSubmit}
                  >
                    완료
                  </div>
                </div>
              </div>

              <div ref={modalRef} class="my-[-15px]">
                <form onSubmit={handleSubmit} className="pl-9">
                  <div className="mb-1  h-12 w-[352px] ">
                    <div class=" flex items-center">
                      <CustomerTypeButtons
                        selectedCustomerType={selectedCustomerType}
                        handleCustomerTypeClick={handleCustomerTypeClick}
                      />
                    </div>
                  </div>
                  <div class=" modal_item_container">
                    <div class="w-[84px] cursor-default pr-5">
                      <span className="Highlighting">*</span>
                      이름
                    </div>
                    <input
                      class={`modal_item_input pl-16`}
                      type="text"
                      ref={name}
                    />
                  </div>
                  <div class="modal_item_container">
                    <div class="w-[84px] cursor-default pl-1 ">나이 (만)</div>
                    <div className="flex">
                      <input
                        class={` mr-1.5 h-8 w-[60px] rounded border py-2 pl-[20px]  placeholder-gray-300 focus:border-primary-100 focus:outline-none`}
                        type="number"
                        ref={age}
                      />
                      <button
                        type="button"
                        className={`mr-2 rounded border px-4 py-2 ${
                          gender === "MALE"
                            ? "border-Primary-400 text-Primary-400 "
                            : "text-Secondary-200"
                        }`}
                        onClick={() => handleGenderClick("MALE")}
                      >
                        남자
                      </button>
                      <button
                        type="button"
                        className={`rounded border px-4 py-2 ${
                          gender === "FEMALE"
                            ? "border-Danger-400 text-Danger-400"
                            : "text-Secondary-200"
                        }`}
                        onClick={() => handleGenderClick("FEMALE")}
                      >
                        여자
                      </button>
                    </div>
                  </div>
                  {/* <div class=" modal_item_container">
                    <div class="w-[84px] cursor-default pl-1">나이 (만)</div>
                    <input
                      class={` modal_item_input pl-[82px]`}
                      type="number"
                      ref={age}
                    />
                  </div> */}
                  <div class="mb-0.5 flex items-center text-xs text-Secondary-100">
                    <input
                      type="checkbox"
                      id="customCheckbox"
                      className="hidden-checkbox"
                      checked={contractYn}
                      onChange={handleContractYnChange}
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
                      className={` modal_item_input ml-[84px] px-3 `}
                      type="text"
                      ref={address}
                      placeholder="상세 주소 입력"
                    />
                  </div>
                  <div class="modal_item_container mb-1">
                    <div class="w-[84px] cursor-default">
                      {/* <span className="Highlighting">*</span> */}
                      DB 분배일
                    </div>
                    <input
                      type="date"
                      ref={registerDate}
                      class={` modal_item_input pl-[52px]`}
                      placeholder=" 2023.00.00"
                    />
                  </div>
                  <div class="modal_item_container mb-1">
                    <div class="w-[84px] cursor-default pl-2">생년월일</div>
                    <input
                      class={`modal_item_input pl-[52px] `}
                      type="date"
                      ref={birth}
                      placeholder=" 1900.00.00"
                    />
                  </div>
                  <div class="modal_item_container mb-1">
                    <div class="w-[84px] cursor-default ">
                      <span className="Highlighting">*</span>전화번호
                    </div>
                    <input
                      class={` modal_item_input px-3 text-center`}
                      type="text"
                      ref={phone}
                      onChange={handlePhoneInputChange}
                      placeholder="01012345678"
                    />
                  </div>
                  <div class="modal_item_container mb-1">
                    <div class="w-[84px] cursor-default pl-2">직업</div>
                    <input
                      class={`modal_item_input pl-[52px] `}
                      type="text"
                      ref={work}
                      placeholder="직업/직종 입력"
                    />
                  </div>
                  <div class="modal_item_container mb-1">
                    <div class="w-[84px] cursor-default pl-2">평균소득</div>
                    <input
                      class={`modal_item_input pl-[52px] `}
                      type="text"
                      ref={salary}
                      placeholder="월 000만원"
                    />
                  </div>
                  <div class="modal_item_container mb-1">
                    <div class="w-[84px] cursor-default pl-2">관심사항</div>
                    <input
                      class={`modal_item_input pl-[32px] `}
                      type="text"
                      ref={worry}
                      placeholder="보장점검/연금/노후 등"
                    />
                  </div>
                  <div class="modal_item_container mb-1">
                    <div class="w-[84px] cursor-default pl-2">통화가능</div>
                    <input
                      class={`modal_item_input pl-[52px] `}
                      type="text"
                      ref={workTime}
                      placeholder=" 17:00~19:00"
                    />
                  </div>
                  {/* <div class="modal_item_container mb-2">
              <div class="w-[84px] cursor-default pl-2">인수상태</div>
              <input
                type="state"
                class={`modal_item_input
                px-3`}
                ref={state}
                placeholder=" 상담중, 전산완료, 가입불가 "
                as="textarea"
                rows={1}
              />
            </div> */}
                  <div class=" flex h-[68px] w-[352px] ">
                    <div class="w-[84px] cursor-default pl-2 pt-1.5">
                      특이사항
                    </div>
                    <textarea
                      class={`modal_item_input_memo  
                px-3 pt-2`}
                      ref={memo}
                      placeholder=" 월 보험료 00만원/본인점검"
                      rows={3}
                    />
                  </div>
                  <div>
                    <div
                      ref={errorMessageRef}
                      className="mb-[14px] text-center text-xs font-bold text-Danger-600"
                    ></div>
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
          </div>{" "}
        </>
      ) : (
        <div
          className="modal-style "
          show={show}
          style={{ height: modalHeight }}
        >
          <div className="h-8 rounded-t-md  bg-LightMode-SectionBackground px-7 py-[7px] text-sm font-normal">
            <div class="flex cursor-default justify-between font-normal text-LightMode-Text">
              <div>신규고객 추가 </div>
              <img
                class="cursor-pointer"
                onClick={handleClose}
                src={process.env.PUBLIC_URL + "/Close.png"}
              />
            </div>
          </div>
          <div class="mb-[15px]  mr-[18px] mt-2 flex justify-end pb-2">
            <img
              src={process.env.PUBLIC_URL + "/circle-14-4.png"}
              style={{ width: "12px", height: "12px", marginTop: "2px" }}
            />
            <span class="cursor-default text-[12px]">필수입력사항</span>
          </div>
          <div ref={modalRef} class="my-[-15px]">
            <form onSubmit={handleSubmit} className=" h-full w-full  pl-6">
              <div className="mb-1  h-12 w-[352px] ">
                <div class=" flex items-center">
                  <div className="w-[84px] cursor-default pb-4">
                    {/* <span className="Highlighting">*</span> */}
                    고객유형
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
                  class={`modal_item_input pl-16`}
                  type="text"
                  ref={name}
                />
              </div>
              <div class="modal_item_container">
                <div class="w-[84px] cursor-default pl-1 ">나이 (만)</div>
                <div className="flex">
                  <input
                    class={` mr-1.5 h-8 w-[60px] rounded border py-2 pl-[20px]  placeholder-gray-300 focus:border-primary-100 focus:outline-none`}
                    type="number"
                    ref={age}
                  />
                  <button
                    type="button"
                    className={`mr-2 rounded border px-4 py-2 ${
                      gender === "MALE"
                        ? "border-Primary-400 text-Primary-400 "
                        : "text-Secondary-200"
                    }`}
                    onClick={() => handleGenderClick("MALE")}
                  >
                    남자
                  </button>
                  <button
                    type="button"
                    className={`rounded border px-4 py-2 ${
                      gender === "FEMALE"
                        ? "border-Danger-400 text-Danger-400"
                        : "text-Secondary-200"
                    }`}
                    onClick={() => handleGenderClick("FEMALE")}
                  >
                    여자
                  </button>
                </div>
              </div>
              <div class="mb-0.5 flex items-center text-xs text-Secondary-100">
                <input
                  type="checkbox"
                  id="customCheckbox"
                  className="hidden-checkbox"
                  checked={contractYn}
                  onChange={handleContractYnChange}
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
                  className={` modal_item_input ml-[84px] px-3 `}
                  type="text"
                  ref={address}
                  placeholder="상세 주소 입력"
                />
              </div>
              <div class="modal_item_container mb-1">
                <div class="w-[84px] cursor-default">
                  {/* <span className="Highlighting">*</span> */}
                  DB 분배일
                </div>
                <input
                  type="date"
                  ref={registerDate}
                  class={` modal_item_input pl-[52px]`}
                  placeholder=" 2023.00.00"
                />
              </div>
              <div class="modal_item_container mb-1">
                <div class="w-[84px] cursor-default pl-2">생년월일</div>
                <input
                  class={`modal_item_input pl-[52px] `}
                  type="date"
                  ref={birth}
                  placeholder=" 1900.00.00"
                />
              </div>
              <div class="modal_item_container mb-1">
                <div class="w-[84px] cursor-default ">
                  <span className="Highlighting">*</span>전화번호
                </div>
                <input
                  class={` modal_item_input px-3 text-center`}
                  type="text"
                  ref={phone}
                  onChange={handlePhoneInputChange}
                  placeholder="01012345678"
                />
              </div>
              <div class="modal_item_container mb-1">
                <div class="w-[84px] cursor-default pl-2">직업</div>
                <input
                  class={`modal_item_input pl-[52px] `}
                  type="text"
                  ref={work}
                  placeholder="직업/업종 입력"
                />
              </div>
              <div class="modal_item_container mb-1">
                <div class="w-[84px] cursor-default pl-2">평균소득</div>
                <input
                  class={`modal_item_input pl-[52px] `}
                  type="text"
                  ref={salary}
                  placeholder="월 000만원"
                />
              </div>
              <div class="modal_item_container mb-1">
                <div class="w-[84px] cursor-default pl-2">관심사항</div>
                <input
                  class={`modal_item_input pl-[32px] `}
                  type="text"
                  ref={worry}
                  placeholder="보장점검/연금/노후 등"
                />
              </div>
              <div class="modal_item_container mb-1">
                <div class="w-[84px] cursor-default pl-2">통화가능</div>
                <input
                  class={`modal_item_input pl-[52px] `}
                  type="text"
                  ref={workTime}
                  placeholder="17:00~19:00"
                />
              </div>

              {/* <div class="modal_item_container mb-2">
              <div class="w-[84px] cursor-default pl-2">인수상태</div>
              <input
                type="state"
                class={`modal_item_input
                px-3`}
                ref={state}
                placeholder=" 상담중, 전산완료, 가입불가 "
                as="textarea"
                rows={1}
              />
            </div> */}
              <div class=" flex h-[68px] w-[352px] ">
                <div class="w-[84px] cursor-default pl-2 pt-1.5">특이사항</div>
                <textarea
                  class={`modal_item_input_memo  
                px-3 pt-2`}
                  ref={memo}
                  placeholder=" 월 보험료 00만원/본인점검"
                  rows={3}
                />
              </div>
              <div>
                <div
                  ref={errorMessageRef}
                  className="mb-[14px] text-center text-xs font-bold text-Danger-600"
                ></div>
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
      )}
    </>
  );
}

export default Modal1;
