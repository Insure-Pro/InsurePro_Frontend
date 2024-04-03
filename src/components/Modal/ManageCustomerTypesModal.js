import axios from "axios";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function ManageCustomerTypesModal({ show, close }) {
  const [name, setName] = useState("");
  //   const [dataType, setDataType] = useState(true);
  const [customerType, setCustomerType] = useState("DB");
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const close_icon = process.env.PUBLIC_URL + "/Close.png";
  const add_icon = process.env.PUBLIC_URL + "/add_button.png";
  const check_on = process.env.PUBLIC_URL + "/check_on_14.png";
  const check_off = process.env.PUBLIC_URL + "/check_off_14.png";

  // handleDataTypeChange 함수를 수정하여 customerType 상태를 토글합니다.
  const handleDataTypeChange = () => {
    setCustomerType((prev) => (prev === "DB" ? "ETC" : "DB"));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name,
      dataType: customerType,
    };
    try {
      await axios.post(`${MAIN_URL}/customerType`, formData, {
        headers: {
          Authorization: `Bearer${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (err) {
      console.log(formData);
      console.error("Error while submitting data", err);
    }
  };

  ////////////////////////////////////////////////////////
  //   const [name, setName] = useState("");
  //   const [customerType, setCustomerType] = useState("DB");
  //   const MAIN_URL = process.env.REACT_APP_MAIN_URL;
  //   const [customerTypes, setCustomerTypes] = useState([]); // 서버에서 가져온 고객 유형들을 저장할 상태

  //   const close_icon = process.env.PUBLIC_URL + "/Close.png";
  //   const add_icon = process.env.PUBLIC_URL + "/add_button.png";
  //   const check_on = process.env.PUBLIC_URL + "/check_on_14.png";
  //   const check_off = process.env.PUBLIC_URL + "/check_off_14.png";

  //   useEffect(() => {
  //     // 모달이 열릴 때 서버에서 고객 유형을 불러오는 함수
  //     const fetchCustomerTypes = async () => {
  //       const response = await axios.get(`${MAIN_URL}/customerTypes/employee`, {
  //         headers: {
  //           Authorization: `Bearer${localStorage.getItem("accessToken")}`,
  //         },
  //       });
  //       setCustomerTypes(response.data); // 응답 데이터를 상태에 저장
  //     };

  //     if (show) {
  //       fetchCustomerTypes();
  //     }
  //   }, [show, MAIN_URL]);

  //   const handleDataTypeChange = () => {
  //     setCustomerType((prev) => (prev === "DB" ? "ETC" : "DB"));
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const formData = {
  //       name,
  //       dataType: customerType,
  //     };

  //     try {
  //       await axios.post(`${MAIN_URL}/customerType`, formData, {
  //         headers: {
  //           Authorization: `Bearer${localStorage.getItem("accessToken")}`,
  //         },
  //       });
  //       // POST 요청 성공 후, 즉시 고객 유형 목록을 다시 불러옵니다.
  //       await fetchCustomerTypes();
  //       setName(""); // 입력 필드 초기화
  //     } catch (err) {
  //       console.error("Error while submitting data", err);
  //     }
  //   };

  ////////////////////////////////////////////////////////
  return (
    <Modal
      className="history-modal-style"
      show={show}
      style={{ marginTop: "130px" }}
    >
      <div class="h-8 rounded-t-md  bg-LightMode-SectionBackground px-7 py-[7px] text-sm font-normal">
        <div class="flex justify-between">
          <div>고객 유형 설정</div>
          <img class="cursor-pointer" onClick={close} src={close_icon} />
        </div>
      </div>
      <div className="Modal_container">
        <Form onSubmit={handleSubmit}>
          <div class="h-[160px]">
            <div class="flex justify-between border-b  border-LightMode-Hover">
              <input
                class="h-[40px] w-[76px] px-3 py-2"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="고객유형 입력"
              />
              <div class="flex h-[40px] items-center justify-center">
                <img
                  src={customerType === "DB" ? check_on : check_off}
                  onClick={handleDataTypeChange}
                  alt="checkbox"
                  class="mr-2 h-3 w-3"
                />
                <span class="w-[50px]">
                  {customerType === "DB" ? "DB유형" : "그 외"}
                </span>
              </div>
            </div>
          </div>
          <div class="flex h-[40px] items-center justify-center font-normal text-Primary-400">
            + 새로운 유형 추가하기
          </div>
          <div>
            <button
              class=" mt-2 flex  h-10 w-[280px] items-center justify-center rounded border border-Primary-300 text-[17px] font-semibold text-Primary-300 hover:bg-Primary-400 hover:text-LightMode-Background"
              type="submit"
            >
              저장
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default ManageCustomerTypesModal;
