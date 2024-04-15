import { useCustomerTypes } from "../../hooks/useCustomerTypes";
import { useAddCustomerType } from "../../hooks/useAddCustomerType";
import { useUpdateCustomerType } from "../../hooks/useUpdateCustomerType"; // New hook
import { useState, useEffect } from "react";

function ManageCustomerTypesModal({ show, close }) {
  const close_icon = process.env.PUBLIC_URL + "/Close.png";
  const add_icon = process.env.PUBLIC_URL + "/add_button.png";
  const check_on = process.env.PUBLIC_URL + "/check_on_14.png";
  const check_off = process.env.PUBLIC_URL + "/check_off_14.png";

  const [name, setName] = useState("");
  const [dataType, setDataType] = useState("DB"); // Default to 'DB'
  const [delYn, setDelYn] = useState("false");
  const { data: customerTypes, isLoading } = useCustomerTypes();
  const addMutation = useAddCustomerType();

  const [visibility, setVisibility] = useState({});
  const updateMutation = useUpdateCustomerType(); // 고객유형정보 수정 hook

  const handleDataTypeToggle = () =>
    setDataType(dataType === "DB" ? "ETC" : "DB");

  const handleSubmit = async (e) => {
    e.preventDefault();
    addMutation.mutate({ name, dataType }); // 서버에 새 고객 유형 추가 요청
    setName(""); // 입력 필드 초기화
  };

  useEffect(() => {
    if (customerTypes) {
      // 고객 유형 데이터가 있는지 확인
      const initialVisibility = customerTypes.reduce((acc, type) => {
        acc[type.pk] = type.delYn; // 각 고객 유형에 대해 주요 키(pk)를 사용하여 객체에 항목을 생성하고, delYn 값을 값으로 설정
        return acc; // 갱신된 누적값 객체를 다음 반복이나 최종 결과로 사용하기 위해 반환
      }, {}); // 누적값의 시작은 빈 객체
      setVisibility(initialVisibility); // 객체를 사용하여 각 고객 유형 ID와 그 가시성 상태를 매핑하는 상태를 업데이트
      console.log("여기서 업데이트 되나?", visibility);
    }
  }, [customerTypes]); // 이 효과는 customerTypes에 의존하므로 customerTypes가 변경될 때마다 재실행

  const handleHideOptionToggle = (typeId) => {
    console.log("업데이트 전", visibility);
    const newVisibility = { ...visibility, [typeId]: !visibility[typeId] }; // 기존 가시성 상태를 복사하고 특정 typeId에 대한 boolean 값을 반전시켜 숨김 상태를 토글
    setVisibility(newVisibility); // 로컬 상태를 새로운 가시성 맵으로 업데이트합니다.
    console.log("업데이트 후 ", visibility);
    updateMutation.mutate({ pk: typeId, delYn: newVisibility[typeId] }); // 서버에 변경된 delYn 상태를 반영하기 위해 PATCH 요청을 전송
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
                  <div
                    class={`h-4 w-[36px] cursor-pointer text-xs ${
                      delYn ? "text-LightMode-Subtext" : " text-Primary-200"
                    }`}
                    onClick={() => handleHideOptionToggle(type.pk)}
                  >
                    숨기기
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
