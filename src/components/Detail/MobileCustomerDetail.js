import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditModalD from "../Modal/EditModalD";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "../../App.css";
import { useCustomerTypes } from "../../hooks/CustomerTypes/useCustomerTypes";
import CustomerModal from "../Modal/CustomerModal";

const MobileCustomerDetail = ({
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

  // In CustomerDetail or similar component
  if (!customer) {
    return <div>Loading...</div>; // Or any other loading indicator
  }
  return (
    <div className="h-[560px] w-full bg-LightMode-SectionBackground text-center">
      <div className="mx-auto flex h-7 w-[360px]   ">
        <div class="flex w-full justify-center">
          <span
            className="mx-auto flex  h-full items-center pl-5 text-[10px]"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              style={{ marginRight: "12px" }}
            />
            고객 리스트로 돌아가기
          </span>
          <div class="h-full w-[220px]"></div>
        </div>
      </div>
      <div class="flex h-3/4 w-full flex-row justify-center bg-white ">
        <div class="flex w-full flex-col justify-center">
          <div class="mx-auto flex h-[80px] w-[360px] items-center py-3 pl-6 pr-1">
            <div class="mb-3 mr-4 flex h-[24px] w-[45px] flex-col items-center">
              <div
                class="flex h-6 items-center text-[17px] font-bold"
                style={{ color: customerTypeColor }}
              >
                {customer.customerType.name}
              </div>
              <div class="mt-1 flex h-4 w-[44px] justify-center rounded border bg-Primary-50  ">
                <button
                  class="flex items-center justify-center py-1 text-[10px] font-normal text-Primary-500
                "
                >
                  상담현황
                </button>
              </div>
            </div>
            <div>
              <div class="ml-1 flex">
                <input
                  type="checkbox"
                  id="customCheckbox"
                  className="hidden-checkbox"
                  checked={customer.contractYn}
                  readOnly
                />
                <label htmlFor="customCheckbox" class="checkbox-label"></label>
                <div
                  class={` mb-[7px] ml-1 text-left text-[8px] ${
                    customer.contractYn
                      ? "text-Primary-300"
                      : "text-LightMode-Text"
                  }`}
                >
                  {customer.contractYn ? "계약완료 고객" : "계약 미완료 고객"}
                </div>
              </div>
              <div
                class="mb-1 flex
                  text-base font-semibold text-LightMode-Text "
              >
                <div>{customer.name}</div>
                <div class="ml-1 text-base font-semibold">
                  {" "}
                  (만 {customer.age}세)
                </div>
                <div class=" ml-[110px] h-[20px] w-[20px] ">
                  <img
                    className=" mb-0.5 ml-1 cursor-pointer pl-0.5 text-gray-400"
                    src={imageUrl}
                    onClick={onEditClick}
                  />
                  {showEditModal && (
                    <EditModalD
                      show={showEditModal}
                      onClose={(updatedData) => {
                        setSelectedCustomer(updatedData);
                      }}
                      onHide={onCloseModal}
                      selectedCustomer={customer}
                      onUpdateSuccess={onUpdateSuccess}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div class="h-7/8 mb-[-84px] flex w-full flex-col bg-LightMode-SectionBackground px-4 text-xs ">
            <div class="mx-auto mb-2 mt-3 flex h-6 w-[320px] text-sm font-semibold">
              기본정보
            </div>
            <div class="mx-auto h-[58px] w-[320px] rounded-t-md bg-white py-2.5 pl-6">
              <div class="mb-2 flex font-semibold">생년월일 </div>
              <span class=" flex">{customer.birth}</span>
            </div>
            <hr class="mx-auto w-[320px]" />
            <div class="mx-auto h-[58px] w-[320px] bg-white py-2.5 pl-6">
              <div class="mb-2 flex font-semibold">주소 </div>
              <span class="flex">{customer.dongString}</span>
            </div>
            <hr class="mx-auto w-[320px]" />
            <div class="mx-auto h-[58px] w-[320px] bg-white py-2.5 pl-6">
              <div class="mb-2 flex font-semibold">전화번호 </div>
              <span class="flex">{customer.phone}</span>
            </div>
            <hr class="mx-auto w-[320px]" />
            <div class="mx-auto flex w-[320px]  flex-col bg-white py-2.5 pl-6">
              <div class="mb-2  text-left  font-semibold">DB분배일 </div>
              <div class="text-left">{customer.registerDate}</div>
            </div>
            <hr class="mx-auto w-[320px]" />
            <div class="mx-auto flex h-[58px] w-[320px] flex-col bg-white py-2.5 pl-6 text-left">
              <div class="h-[30px] font-semibold">인수상태</div>
              <div class="h-7">{customer.state}</div>
            </div>
            <hr class="mx-auto w-[320px]" />
            <div class="mx-auto flex h-[72px] w-[320px] flex-col rounded-b-md bg-white py-2.5 pl-6 text-left">
              <div class="h-[30px] font-semibold">특이사항 </div>
              <div class="h-7 ">{customer.memo}</div>
            </div>
            <hr class="mx-auto w-[320px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MobileCustomerDetail;
