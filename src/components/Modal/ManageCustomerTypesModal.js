import axios from "axios";
import { useCustomerTypes } from "../../hooks/useCustomerTypes";
import { useAddCustomerType } from "../../hooks/useAddCustomerType";
import { useState, useEffect } from "react";

function ManageCustomerTypesModal({ show, close }) {
  // const [name, setName] = useState("");
  //   const [dataType, setDataType] = useState(true);
  // const [customerType, setCustomerType] = useState("DB");
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const close_icon = process.env.PUBLIC_URL + "/Close.png";
  const add_icon = process.env.PUBLIC_URL + "/add_button.png";
  const check_on = process.env.PUBLIC_URL + "/check_on_14.png";
  const check_off = process.env.PUBLIC_URL + "/check_off_14.png";

  const [name, setName] = useState("");
  const [dataType, setDataType] = useState("DB"); // Default to 'DB'
  const { data: customerTypes, isLoading } = useCustomerTypes();
  const addMutation = useAddCustomerType();

  // handleDataTypeChange 함수를 수정하여 customerType 상태를 토글합니다.
  // const handleDataTypeChange = () => {
  //   setCustomerType((prev) => (prev === "DB" ? "ETC" : "DB"));
  // };

  const handleDataTypeToggle = () =>
    setDataType(dataType === "DB" ? "ETC" : "DB");

  // const [customerTypes, setCustomerTypes] = useState([]); // 서버에서 가져온 고객 유형들을 저장할 상태

  useEffect(() => {
    // 모달이 열릴 때 서버에서 고객 유형을 불러오는 함수
    const fetchCustomerTypes = async () => {
      const response = await axios.get(`${MAIN_URL}/customerTypes/employee`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // setCustomerTypes(response.data); // 응답 데이터를 상태에 저장
    };

    if (show) {
      fetchCustomerTypes();
    }
  }, [show, MAIN_URL]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = {
  //     name,
  //     dataType: customerType,
  //   };

  //   try {
  //     await axios.post(`${MAIN_URL}/customerType`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     });
  //     // POST 요청 성공 후, 즉시 고객 유형 목록을 다시 불러옵니다.
  //     // await fetchCustomerTypes();
  //     setName(""); // 입력 필드 초기화
  //   } catch (err) {
  //     console.error("Error while submitting data", err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    addMutation.mutate({ name, dataType });
    setName("");
  };

  return (
    <div
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
      <div className="Modal_container ">
        <form onSubmit={handleSubmit}>
          <div class="h-[38px] border-b border-LightMode-Hover  px-7">
            <div class="flex justify-between ">
              <input
                class="h-[36px] w-[76px] py-2"
                type="text"
                value={name}
                // onChange={(e) => setName(e.target.value)}
                // value={newTypeName}
                onChange={(e) => setName(e.target.value)}
                placeholder="고객유형"
              />
              <div class="flex h-[36px] items-center justify-center">
                <img
                  src={dataType === "DB" ? check_on : check_off}
                  onClick={handleDataTypeToggle}
                  alt="checkbox"
                  class="mr-2 h-3 w-3"
                />
                <span class="w-[50px]">
                  {dataType === "DB" ? "DB유형" : "그 외"}
                </span>
              </div>
            </div>
          </div>
          <div class="h-[140px] w-full overflow-y-auto">
            {customerTypes?.map((type) => (
              <div class=" ">
                <div class="flex h-[38px] w-full  items-center  pl-7">
                  <div class="mr-[200px] h-[18px] w-8 text-sm" key={type.id}>
                    {type.name}
                  </div>
                  <div class="h-4 w-[36px] text-xs text-LightMode-Subtext">
                    {type.delYn ? "" : "숨기기"}
                  </div>
                </div>
                <hr class="ml-[-32px] h-[1px] w-[352px] bg-LightMode-Hover" />
              </div>
            ))}
          </div>
          <div class="flex h-[40px] items-center justify-center font-normal text-Primary-400">
            + 새로운 유형 추가하기
          </div>
          <div class="px-8">
            <button
              class=" mt-2 flex  h-10 w-[280px] items-center justify-center rounded border border-Primary-300 text-[17px] font-semibold text-Primary-300 hover:bg-Primary-400 hover:text-LightMode-Background"
              type="submit"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManageCustomerTypesModal;
