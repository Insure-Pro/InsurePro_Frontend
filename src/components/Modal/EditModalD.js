import axios from "axios";
import { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { Row, Col } from "react-bootstrap";
import hangjungdong from "./hangjungdong";

const EditModalD = ({ show, onHide, selectedCustomer, onUpdateSuccess }) => {
  const nameRef = useRef("");
  const ageRef = useRef("");
  const registerDateRef = useRef("");
  const birthRef = useRef("");
  const phoneRef = useRef("");
  const addressRef = useRef("");
  const stateRef = useRef("");
  const memoRef = useRef("");

  const [phoneNumber, setPhoneNumber] = useState("");

  // 선택된 고객 유형을 나타내는 state
  const [selectedCustomerType, setSelectedCustomerType] = useState("");
  const [contractYn, setContractYn] = useState(false);

  const close_icon = process.env.PUBLIC_URL + "/Close.png";
  const circle_icon_middle = process.env.PUBLIC_URL + "/circle-14-4.png";

  const modalRef = useRef(); // Reference to the modal
  const handleClose = () => {
    onHide();
    // Check if the click is outside the modal content
    // if (modalRef.current && !modalRef.current.contains(event.target)) {
    //   onHide();
    // }
  };

  EditModalD.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    selectedCustomer: PropTypes.object.isRequired,
    onUpdateSuccess: PropTypes.func.isRequired,
  };

  // useEffect that updates state only when selectedCustomer changes
  useEffect(() => {
    if (selectedCustomer) {
      setSelectedCustomerType(selectedCustomer?.customerType || "");
      setContractYn(selectedCustomer?.contractYn || false);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedCustomer && selectedCustomer.metroGuDong) {
      // 이름을 식별자로 변환
      const sidoId =
        hangjungdong.sido.find(
          (el) => el.codeNm === selectedCustomer.metroGuDong.metroName,
        )?.sido || "";
      const sigugunId =
        hangjungdong.sigugun.find(
          (el) =>
            el.codeNm === selectedCustomer.metroGuDong.guName &&
            el.sido === sidoId,
        )?.sigugun || "";
      const dongId =
        hangjungdong.dong.find(
          (el) =>
            el.codeNm === selectedCustomer.metroGuDong.dongName &&
            el.sido === sidoId &&
            el.sigugun === sigugunId,
        )?.dong || "";

      // 상태 업데이트
      setSelectedSido(sidoId);
      setSelectedSigugun(sigugunId);
      setSelectedDong(dongId);
    }
  }, [selectedCustomer, hangjungdong]);

  const customerTypes = ["OD", "AD", "CP", "CD", "JD", "H", "X", "Y", "Z"];

  const customerTypeColors = {
    OD: "var(--colorN-1)",
    AD: "var(--colorN-2)",
    CP: "var(--colorN-3)",
    CD: "var(--colorN-4)",
    JD: "var(--colorN-5)",
    H: "var(--colorN-6)",
    X: "var(--colorN-7)",
    Y: "var(--colorN-8)",
    Z: "var(--colorN-9)",
  };

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
    // 이미 선택된 유형을 다시 클릭하면 선택 해제
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
  };

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const birthValue = birthRef.current.value.replace(/[./]/g, "-");
    const registerDateValue = registerDateRef.current.value.replace(
      /[./]/g,
      "-",
    );
    const ageValue = calculateKoreanAge(birthValue);
    const phoneSend = phoneNumber || phoneRef.current.value;

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
        },
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
            onUpdateSuccess,
          );
        }
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
      <Modal show={show} onHide={onHide} className="modal-style">
        <div
          className="h-8 rounded-t-md bg-LightMode-SectionBackground  px-7 py-[7px] text-sm font-normal"
          // style={{ margin: "0px" }}
        >
          <div class="mb-10 flex justify-between font-normal text-LightMode-Text">
            <div>고객정보 수정</div>
            <img class="cursor-pointer" onClick={onHide} src={close_icon} />
          </div>
        </div>
        <div class="mb-[15px] ml-0 mr-[18px] mt-2 flex justify-end pb-2">
          <img
            src={circle_icon_middle}
            style={{ width: "12px", height: "12px", marginTop: "2px" }}
          />
          <span class="text-[12px]">필수입력사항</span>
        </div>
        <Modal.Body className="Modal_container" style={{ margin: "-15px 0px" }}>
          <Form onSubmit={handleSubmit}>
            {/* <div className="mb-4" controlId="formName">
              <Form.Control
                type="text"
                placeholder="이름"
                defaultValue={selectedCustomer?.name}
                ref={nameRef}
              />
            </div> */}
            {/* <div controlId="contractYn.ControlCheckbox1">
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
            </div> */}
            <div className="mb-1  h-12 w-[352px] ">
              <div className=" flex items-center">
                <div className="w-[84px] pb-4 ">
                  {" "}
                  <span className="Highlighting">*</span>고객유형
                </div>
                <div className="flex h-12 w-52 items-center  overflow-x-scroll whitespace-nowrap  ">
                  {Object.keys(customerTypeColors).map((type, idx) => (
                    <button
                      key={idx}
                      className=" flex h-7 w-12 items-center border border-gray-300 px-[14px] py-[5px] outline-none"
                      type="button"
                      style={{
                        color:
                          selectedCustomerType === type
                            ? "white"
                            : "var(--Gray-scale-100)",
                        backgroundColor:
                          selectedCustomerType === type
                            ? customerTypeColors[type]
                            : "transparent",
                        borderColor:
                          selectedCustomerType === type
                            ? customerTypeColors[type]
                            : "var(--Gray-scale-100)",
                        fontWeight:
                          selectedCustomerType === type ? "bold" : "normal",
                      }}
                      value={selectedCustomerType}
                      onClick={() => handleCustomerTypeClick(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className=" modal_item_container">
              <div class="w-[84px]">
                <span className="Highlighting">*</span>
                이름
              </div>
              <input
                class={`modal_item_input   pl-[70px]`}
                type="text"
                defaultValue={selectedCustomer?.name}
                ref={nameRef}
                // value={nameInput}
              />
            </div>
            <div class=" modal_item_container">
              <div class="w-[84px] pl-2">나이 (만)</div>
              <input
                class={` modal_item_input  pl-[82px]`}
                type="number"
                defaultValue={selectedCustomer?.age}
                ref={ageRef}
                // value={ageInput}
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
                className={` modal_item_input  ml-[84px] px-3 `}
                type="text"
                ref={addressRef}
                defaultValue={selectedCustomer?.address}
                placeholder="상세 주소 입력"
              />
            </div>
            <div class="modal_item_container mb-1">
              <div class="w-[84px]">
                <span className="Highlighting">*</span>
                DB 분배일
              </div>
              <input
                class={` modal_item_input  pl-[52px]`}
                type="date"
                ref={registerDateRef}
                // value={registerDateInput}
                defaultValue={selectedCustomer?.registerDate}
                placeholder=" 2023.00.00"
              />
            </div>
            <div class="modal_item_container mb-1">
              <div class="w-[84px] pl-2">생년월일</div>
              <input
                class={`modal_item_input  pl-[52px] `}
                type="date"
                defaultValue={selectedCustomer?.birth}
                ref={birthRef}
                placeholder=" 1900.00.00"
              />
            </div>
            <div class="modal_item_container mb-1">
              <div class="w-[84px] ">
                <span className="Highlighting">*</span>전화번호
              </div>
              <input
                class={` modal_item_input  px-3`}
                type="text"
                ref={phoneRef}
                defaultValue={selectedCustomer?.phone}
                onChange={handlePhoneInputChange}
                placeholder=" 010-0000-0000"
              />
            </div>
            <div class="modal_item_container mb-2">
              <div class="w-[84px] pl-2">인수상태</div>
              <input
                class={`modal_item_input px-3`}
                type="state"
                // value={stateInput}
                ref={stateRef}
                defaultValue={selectedCustomer?.state}
                placeholder=" 상담중, 전산완료, 가입불가 "
                as="textarea"
                rows={1}
              />
            </div>
            <div class=" flex h-20 w-[352px] ">
              <div class="w-[84px] pl-2 pt-1.5">특이사항</div>
              <input
                class={`modal_item_input  px-3`}
                ref={memoRef}
                defaultValue={selectedCustomer?.memo}
                // value={memoInput}

                placeholder=" 월 보험료 00만원/본인점검"
                as="textarea"
                rows={3}
              />
            </div>

            <div style={{ marginRight: "-12px" }}>
              <Button variant="primary" type="submit">
                변경사항 저장
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditModalD;
