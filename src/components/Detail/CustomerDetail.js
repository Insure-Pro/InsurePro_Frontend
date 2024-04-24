import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditModalD from "../Modal/EditModalD";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "../../App.css";
import { useCustomerTypes } from "../../hooks/CustomerTypes/useCustomerTypes";

const CustomerDetail = ({
  onUpdateSuccess,
  customer,
  customerPk,
  onEditClick,
  showEditModal,
  onCloseModal,
}) => {
  const navigate = useNavigate();
  const imageUrl = process.env.PUBLIC_URL + "/edit1.png";
  const checkbox = process.env.PUBLIC_URL + "/checkbox-12.png";

  const [selectedCustomer, setSelectedCustomer] = useState(customer); // initialCustomerData는 초기 고객 데이터입니다.

  const { data: customerTypes, isLoading } = useCustomerTypes();
  const [customerTypeColor, setCustomerTypeColor] =
    useState("var(--Success-500)");

  useEffect(() => {
    if (!isLoading && customerTypes) {
      const type = customerTypes.find(
        (type) => type.name === customer.customerType.name,
      );
      if (type) {
        setCustomerTypeColor(type.color);
      }
    }
  }, [customerTypes, isLoading, customer.customerType.name]);

  return (
    <div className="text-center">
      <div className="backpage flex items-center ">
        <span
          className="mx-auto h-full w-[200px] cursor-pointer items-center"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            style={{ marginRight: "16px" }}
          />
          고객 관리 리스트로 돌아가기
        </span>
        <div class="h-full w-[862px]"></div>
      </div>
      <div class="flex h-[174px] w-full  flex-row justify-center border border-Success-200 bg-LightMode-SectionBackground">
        <div class="mx-auto flex w-[1024px]">
          <div className="detailTitle flex items-center border border-Success-500 font-bold">
            {" "}
            기본정보{" "}
            <div class=" h-[20px] w-[20px] ">
              <img
                className=" mb-0.5 ml-1  cursor-pointer pl-1 text-gray-400"
                src={imageUrl}
                onClick={onEditClick}
              />
              <EditModalD
                show={showEditModal}
                onClose={(updatedData) => {
                  setSelectedCustomer(updatedData);
                }}
                onHide={onCloseModal}
                selectedCustomer={customer}
                onUpdateSuccess={onUpdateSuccess}
              />
            </div>
          </div>
          <div class=" flex h-full  w-[145px] items-center border border-Danger-300">
            <div class=" mr-[82px]    border border-Danger-900 ">
              <div class="mb-3 flex h-[24px] w-[145px] items-center border border-Primary-500">
                <div
                  class="flex h-6 items-center border border-Primary-200 text-[17px] font-semibold"
                  style={{ color: customerTypeColor }}
                >
                  {customer.customerType.name}
                </div>
                <button class="ml-2 h-6 w-[64p] rounded border border-Primary-100 bg-Primary-50 px-[10px] ">
                  <span class="text-xs font-normal text-Primary-500">
                    상담현황
                  </span>
                </button>
              </div>
              <div style={{ cursor: "default" }}>
                <div
                  class="mb-1
                 flex text-xl font-bold text-LightMode-Text "
                >
                  <div>{customer.name}</div>
                  <div class="ml-1 text-xl font-bold">
                    {" "}
                    (만 {customer.age}세)
                  </div>
                </div>
                {customer.contractYn && ( // 조건부 렌더링: data.contractYn이 true일 경우만 아래의 div를 렌더링
                  <div class="mb-1.5 flex w-[110px]  items-center text-xs font-bold text-Primary-400">
                    <img src={checkbox} class="mr-1 h-3 w-3" /> 계약완료고객
                  </div>
                )}
              </div>
            </div>
            <div class="flex h-[174px] w-[543px] rounded-[20px] border border-Danger-600 bg-white px-[18px] py-[32px] text-sm font-bold text-LightMode-Subtext shadow-[0_4px_8px_0_rgba(0,0,0,0.05)] ">
              <div class="w-[250px] border border-Primary-200">
                <div class="flex">
                  <div class="mb-2 h-[30px] w-[70px] ">생년월일 </div>
                  <span> : </span>
                  <span class="w-[175px] border border-Primary-600">
                    {customer.birth}
                  </span>
                </div>
                <div class="flex">
                  <div class="mb-2 h-[30px] w-[70px]">번호 </div>
                  <span> : </span>
                  <span class="w-[175px] border border-Primary-600">
                    {customer.phone}
                  </span>
                </div>
                <div class="flex">
                  <div class="h-[30px] w-[70px]">주소 </div>
                  <span> : </span>
                  <span class="w-[175px] border border-Primary-600">
                    {customer.dongString}
                  </span>
                </div>
              </div>
              <div class="w-[250px] border border-Primary-200">
                <div class="flex">
                  <div class="mb-2 h-[30px] w-[70px] ">DB분배일 </div>
                  <span> : </span>
                  <span class="w-[175px] border border-Primary-600">
                    {customer.registerDate}
                  </span>
                </div>
                <div class="flex">
                  <div class="mb-2 h-[30px] w-[70px]">인수상태</div>
                  <span> : </span>
                  <span class="w-[175px] border border-Primary-600">
                    {customer.state}
                  </span>
                </div>
                <div class="flex">
                  <div class="h-[30px] w-[70px]">특이사항 </div>
                  <span> : </span>
                  <span class="w-[175px] border border-Primary-600">
                    {customer.memo}
                  </span>
                </div>
              </div>
            </div>

            {/* <div class=" ">{data.phone}</div>
            <div className="">
              <span className="">Db 분배일</span>
              <span className="">{data.registerDate}</span>
            </div>
            <div className="">
              <span className="">인수상태</span>
              <span className="">{data.state}</span>
            </div>
            <div className="">
              <span className="">특이사항</span>
              <span className="">{data.memo}</span>
            </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerDetail;
