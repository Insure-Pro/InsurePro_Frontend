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
    <div className="h-[560px]  w-full  bg-white text-center">
      <div className="mx-auto flex h-6 w-[360px]   ">
        <div class="flex w-full justify-center">
          <span
            className="mx-auto h-full  text-sm "
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              style={{ marginRight: "12px" }}
            />
            뒤로가기
          </span>
          <div class="h-full w-[250px]"></div>
        </div>
      </div>
      <div class="mx-auto flex h-full w-[360px] flex-row justify-center  bg-white ">
        <div class="mx-auto flex w-full flex-col justify-center ">
          <div class=" h-[130px] w-full border px-5 py-3  ">
            <div class="mb-3 flex  h-[24px] w-[145px] items-center  ">
              <div
                class="flex h-6 items-center text-[17px] font-semibold"
                style={{ color: customerTypeColor }}
              >
                {customer.customerType.name}
              </div>
              <button class="ml-2 h-6 w-[64px] rounded bg-Primary-50 px-[10px] ">
                <span class="text-xs font-normal text-Primary-500">
                  상담현황
                </span>
              </button>
            </div>
            <div>
              <div
                class="mb-1 flex
                  text-base font-semibold text-LightMode-Text "
              >
                <div>{customer.name}</div>
                <div class="ml-1 text-base font-semibold">
                  {" "}
                  (만 {customer.age}세)
                </div>
                <div class=" ml-[180px] h-[20px] w-[20px] ">
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
              <div class="mt-2 flex text-Secondary-100">{customer.phone}</div>
            </div>
          </div>
          <div class="flex h-full w-full flex-col   bg-Secondary-50/60 px-4 text-xs">
            <div class="mt-4 flex h-10 text-sm font-semibold">기본정보</div>
            <div class="rounded-t-md bg-white py-3  pl-3">
              <div class="mb-2 flex font-semibold">생년월일 </div>
              <span class=" flex">{customer.birth}</span>
            </div>
            <hr />
            <div class="bg-white  py-3  pl-3">
              <div class="mb-2 flex  font-semibold">주소 </div>
              <span class="flex">{customer.dongString}</span>
            </div>
            <hr />
            <div class="flex flex-col  bg-white py-3  pl-3">
              <div class="mb-2  text-left  font-semibold">DB분배일 </div>
              <div class="text-left">{customer.registerDate}</div>
            </div>
            <hr />
            <div class="flex flex-col bg-white py-3  pl-3  text-left">
              <div class="h-[30px]  font-semibold">인수상태</div>
              <div class="h-7">{customer.state}</div>
            </div>
            <hr />
            <div class="flex flex-col rounded-b-md bg-white  py-3  pl-3 text-left">
              <div class="h-[30px] font-semibold">특이사항 </div>
              <div class="h-7 ">{customer.memo}</div>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MobileCustomerDetail;
