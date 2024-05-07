import axios from "axios";
import { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal"; // 이거때문에 function Modal이 중복 오류남
import { Row, Col } from "react-bootstrap";
import hangjungdong from "./hangjungdong";
import Swal from "sweetalert2";
import CustomerTypeButtons from "../Button/CustomerTypeButtons";
import { useMediaQuery } from "react-responsive";

const EditModal = ({
  onClose,
  show,
  onHide,
  onModalOpen,
  onModalClose,
  selectedCustomer,
}) => {
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
  const [selectedCustomerType, setSelectedCustomerType] = useState(
    selectedCustomer?.customerType || "",
  );

  const [contractYn, setContractYn] = useState(
    selectedCustomer?.contractYn || false,
  );

  const close_icon = process.env.PUBLIC_URL + "/Close.png";
  const circle_icon_middle = process.env.PUBLIC_URL + "/circle-14-4.png";
  const mobile_modal_top = process.env.PUBLIC_URL + "/mobile_modal_top.png";
  // const add_icon = process.env.PUBLIC_URL + "/add_button.png";

  const [selectedSido, setSelectedSido] = useState("");
  const [selectedSigugun, setSelectedSigugun] = useState("");
  const [selectedDong, setSelectedDong] = useState("");

  const { sido, sigugun, dong } = hangjungdong;

  const isMobile = useMediaQuery({ query: "(max-width:500px)" });

  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const handleContractYnChange = () => {
    // 체크박스 상태를 토글
    setContractYn(!contractYn);
  };
  // const [show, setShow] = useState(false);
  const modalRef = useRef(); // Reference to the modal
  const handleClose = (event) => {
    // Check if the click is outside the modal content
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onHide();
    }
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
    const birthValue = birthRef.current.value.replace(/\./g, "-");
    const registerDateValue = registerDateRef.current.value.replace(/\./g, "-");
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
        age: ageRef.current.value,
        address: addressRef.current.value,
        state: stateRef.current.value,
        memo: memoRef.current.value,
        contractYn: contractYn,
        customerTypePk: selectedCustomerType.pk,
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
      // 데이터 업데이트 후 Main.js의 fetchData 함수를 호출하기 위해 onClose를 실행
      if (response.status === 200) {
        Swal.fire({
          html:
            "<div style='text-align: left; font-size:16px;'>" +
            "고객정보 수정이 완료되었습니다.<br><br>" +
            "</div>",
          timer: 3500,
          showConfirmButton: false,
          timerProgressBar: true,
          position: "top", // Position the alert near the top of the screen
        });
        // alert("고객정보 수정이 완료되었습니다");
        onClose();
      }
      onHide(); // Close the modal
    } catch (error) {
      // Handle error: display error message, etc.
      console.error("Error updating customer:", error);
    }
  };

  //모달창 외부 클릭 시 닫힘
  useEffect(() => {
    // Add event listener to document
    document.addEventListener("mousedown", handleClose);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClose);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        // <div class="fixed z-30 m-auto h-scree w-full bg-Success-500">
        <>
          <Modal
            className="modal-style-mobile rounded-t-2xl "
            show={show}
            onHide={handleClose}
            onExited={onModalClose}
          >
            <div className="h-20  px-7 py-[7px] text-sm font-normal">
              <div class="mb-5 flex items-center justify-center">
                <img src={mobile_modal_top} />
              </div>
              <div class="mb-10 flex items-center justify-between font-normal text-LightMode-Text">
                <div
                  class="cursor-pointer text-sm font-normal"
                  onClick={handleClose}
                >
                  취소
                </div>
                <div class="text-base font-bold">고객정보 수정</div>
                <div class="cursor-pointer text-sm font-normal">완료</div>
              </div>
            </div>
            <div class="my-[-15px]" ref={modalRef}>
              <form onSubmit={handleSubmit} class="pl-4">
                <div className="mb-1  h-12 w-[352px] ">
                  <div className=" flex items-center">
                    <CustomerTypeButtons
                      selectedCustomerType={selectedCustomerType}
                      handleCustomerTypeClick={handleCustomerTypeClick}
                    />
                  </div>
                </div>
                <div class="mb-0.5 flex  text-xs text-Secondary-100">
                  <input
                    type="checkbox"
                    id="customCheckbox"
                    className="hidden-checkbox"
                    checked={contractYn} // 체크박스 상태를 반영
                    onChange={handleContractYnChange} // 체크박스 상태 변경 핸들러
                  />
                  <label
                    htmlFor="customCheckbox"
                    class={`checkbox-label_14 mr-1 ${
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
                <div className=" modal_item_container mb-2">
                  <div class="w-[108px] text-sm font-normal">
                    <span className="Highlighting">*</span>
                    이름
                  </div>
                  <input
                    class={`modal_item_input_mobile   pl-[70px]`}
                    type="text"
                    defaultValue={selectedCustomer?.name}
                    ref={nameRef}
                    // value={nameInput}
                  />
                </div>
                <div class="modal_item_container mb-2">
                  <div class="w-[108px] ">
                    <span className="Highlighting">*</span>연락처
                  </div>
                  <input
                    class={` modal_item_input_mobile pl-[52px]`}
                    type="text"
                    ref={phoneRef}
                    defaultValue={selectedCustomer?.phone}
                    onChange={handlePhoneInputChange}
                    placeholder="01012345678"
                  />
                </div>

                <div class="modal_item_container mb-2">
                  <div class="w-[108px]">
                    <span className="Highlighting">*</span>
                    DB 분배일
                  </div>
                  <input
                    class={` modal_item_input_mobile  pl-[52px]`}
                    type="date"
                    ref={registerDateRef}
                    // value={registerDateInput}
                    defaultValue={selectedCustomer?.registerDate}
                    placeholder=" 2023.00.00"
                  />
                </div>
                {/* <div class="modal_item_container mb-2">
                <div class="w-[108px] pl-2">생년월일</div>
                <input
                  class={`modal_item_input_mobile  pl-[52px] `}
                  type="date"
                  defaultValue={selectedCustomer?.birth}
                  ref={birthRef}
                  placeholder=" 1900.00.00"
                />
              </div> */}
                <div class=" modal_item_container mb-2 ">
                  <div class="w-[108px] pl-2">나이 (만)</div>
                  <input
                    class={` modal_item_input_mobile  pl-[82px]`}
                    type="number"
                    defaultValue={selectedCustomer?.age}
                    ref={ageRef}
                    // value={ageInput}
                  />
                </div>
                <div className=" mb-1">
                  <div class="flex h-[40px] w-[75px] items-center ">
                    <span>
                      <span className="Highlighting">*</span>
                    </span>
                    주소
                  </div>
                  <div class="flex">
                    <Col>
                      <div class="flex" controlId="sidoSelect">
                        <Form.Select
                          className={`modal_address_item_mobile ${
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
                    <div>
                      <div class="flex" controlId="sigugunSelect">
                        <span> </span>
                        <Form.Select
                          className={`modal_address_item_mobile ml-1.5 ${
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
                    </div>
                    <div>
                      <div class="flex" controlId="dongSelect">
                        <span></span>
                        <Form.Select
                          className={`modal_address_item_mobile ml-1.5 ${
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
                    </div>
                  </div>
                </div>
                <div class=" mb-3 flex items-center">
                  <input
                    className={` modal_item_input_memo_mobile  px-3 `}
                    type="text"
                    ref={addressRef}
                    defaultValue={selectedCustomer?.address}
                    placeholder="상세 주소 입력"
                  />
                </div>

                <div class=" flex h-6 w-[352px] items-center">
                  <div class="w-[84px] pl-2">인수상태</div>
                </div>
                <input
                  class={`modal_item_input_memo_mobile mb-3 px-3`}
                  type="state"
                  // value={stateInput}
                  ref={stateRef}
                  defaultValue={selectedCustomer?.state}
                  placeholder=" 상담중, 전산완료, 가입불가 "
                  as="textarea"
                  rows={1}
                />
                <div class=" flex h-6 w-[352px] items-center">
                  <div class="w-[84px] pl-2">특이사항</div>
                </div>
                <textarea
                  class={`modal_item_input_memo_mobile  mb-3 px-3 pt-2`}
                  ref={memoRef}
                  defaultValue={selectedCustomer?.memo}
                  placeholder=" 월 보험료 00만원/본인점검"
                  rows={3}
                />

                <div>
                  {/* <Button variant="secondary" onClick={handleClose}>
                   취소
                 </Button> */}
                  <button
                    class="flex h-[32px] w-[278px] items-center justify-center rounded border border-primary-100 py-2 text-[17px] font-semibold text-primary-100 hover:bg-primary-100 hover:text-white"
                    type="submit"
                  >
                    등록
                  </button>
                </div>
              </form>
            </div>
          </Modal>
          <div class=" fixed bottom-60 z-20 h-full w-full bg-black/40"></div>
        </>
      ) : (
        <Modal
          className="modal-style  "
          show={show}
          onHide={handleClose}
          onExited={onModalClose}
        >
          <div className="h-8 rounded-t-md bg-LightMode-SectionBackground  px-7 py-[7px] text-sm font-normal">
            <div class="mb-10 flex justify-between font-normal text-LightMode-Text">
              <div>고객정보 수정</div>
              <img
                class="cursor-pointer"
                onClick={handleClose}
                src={close_icon}
              />
            </div>
          </div>
          <div class="mb-[15px] ml-0 mr-[18px] mt-2 flex justify-end pb-2">
            <img
              src={circle_icon_middle}
              style={{ width: "12px", height: "12px", marginTop: "2px" }}
            />
            <span class="text-[12px]">필수입력사항</span>
          </div>
          <div class="my-[-15px]" ref={modalRef}>
            <form onSubmit={handleSubmit} class="pl-8">
              <div className="mb-1  h-12 w-[352px] ">
                <div className=" flex items-center">
                  <div className="w-[84px] pb-4 ">
                    {" "}
                    <span className="Highlighting">*</span>고객유형
                  </div>
                  <CustomerTypeButtons
                    selectedCustomerType={selectedCustomerType}
                    handleCustomerTypeClick={handleCustomerTypeClick}
                  />
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
                <div class="w-[84px] pl-2">나이 (만)</div>
                <input
                  class={` modal_item_input  pl-[82px]`}
                  type="number"
                  defaultValue={selectedCustomer?.age}
                  ref={ageRef}
                  // value={ageInput}
                />
              </div>
              <div className=" flex  items-center">
                <div class="flex h-[40px] w-[75px] items-center pl-2">주소</div>
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
                  class={` modal_item_input pl-[52px]`}
                  type="text"
                  ref={phoneRef}
                  defaultValue={selectedCustomer?.phone}
                  onChange={handlePhoneInputChange}
                  placeholder="01012345678"
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
              <div class=" flex h-[68px] w-[352px] ">
                <div class="w-[84px] pl-2 pt-1.5">특이사항</div>
                <textarea
                  class={`modal_item_input_memo  px-3 pt-2`}
                  ref={memoRef}
                  defaultValue={selectedCustomer?.memo}
                  placeholder=" 월 보험료 00만원/본인점검"
                  rows={3}
                />
              </div>

              <div>
                {/* <Button variant="secondary" onClick={handleClose}>
              취소
            </Button> */}
                <button
                  class="flex h-[40px] w-[278px] items-center justify-center rounded border border-primary-100 py-2 text-[17px] font-semibold text-primary-100 hover:bg-primary-100 hover:text-white"
                  type="submit"
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default EditModal;
