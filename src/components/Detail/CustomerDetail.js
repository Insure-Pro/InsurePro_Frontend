import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import EditModalD from "../Modal/EditModalD";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "../../App.css";
import { useCustomerTypes } from "../../hooks/CustomerTypes/useCustomerTypes";
import CustomerModal from "../Modal/CustomerModal";
import Swal from "sweetalert2";
import {
  useCustomer,
  useUpdateConsultationStatus,
} from "../../hooks/CustomerInfo/useConsultationStatus";

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
  const downIcon = process.env.PUBLIC_URL + "/dropdown.png";
  const upIcon = process.env.PUBLIC_URL + "/dropup.png";

  const [selectedCustomer, setSelectedCustomer] = useState(customer); // 초기 고객 데이터
  const { data: customerData, isLoading } = useCustomer(customerPk);
  const updateConsultationStatus = useUpdateConsultationStatus();

  const { data: customerTypes } = useCustomerTypes();
  const [customerTypeColor, setCustomerTypeColor] =
    useState("var(--Success-500)");
  const [consultationStatus, setConsultationStatus] = useState("상담 전");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (customerData) {
      setSelectedCustomer(customerData);
      setConsultationStatus(mapStatusToKorean(customerData.consultationStatus));
    }
  }, [customerData]);

  useEffect(() => {
    if (customerTypes) {
      const type = customerTypes.find(
        (type) => type.name === customer.customerType.name,
      );
      if (type) {
        setCustomerTypeColor(type.color);
      }
    }
  }, [customerTypes, customer.customerType.name]);

  const mapStatusToKorean = (status) => {
    switch (status) {
      case "PRODUCT_PROPOSAL":
        return "상품제안";
      case "MEDICAL_HISTORY_WAITING":
        return "병력대기";
      case "SUBSCRIPTION_REJECTION":
        return "청약거절";
      case "CONSULTATION_REJECTION":
        return "상담거절";
      case "AS_TARGET":
        return "AS대상";
      case "PENDING_CONSULTATION":
        return "상담보류";
      default:
        return "상담 전";
    }
  };

  const mapStatusToEnglish = (status) => {
    switch (status) {
      case "상품제안":
        return "PRODUCT_PROPOSAL";
      case "병력대기":
        return "MEDICAL_HISTORY_WAITING";
      case "청약거절":
        return "SUBSCRIPTION_REJECTION";
      case "상담거절":
        return "CONSULTATION_REJECTION";
      case "상담보류":
        return "PENDING_CONSULTATION";
      case "AS대상":
        return "AS_TARGET";
      default:
        return "CONSULTATION_BEFORE";
    }
  };
  const handleStatusChange = (status) => {
    const englishStatus = mapStatusToEnglish(status);
    setConsultationStatus(status);
    updateConsultationStatus.mutate({ customerPk, status: englishStatus });
    setIsDropdownOpen(false);
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "상품제안":
        return "var(--Primary-500)";
      case "병력대기":
        return "var(--Purple-500)";
      case "청약거절":
        return "var(--Danger-500)";
      case "상담거절":
        return "var(--Danger-300)";
      case "AS대상":
        return "var(--Gray-scale-500)";
      case "상담보류":
        return "var(--Success-500)";
      default:
        return "var(--Secondary-200)";
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case "상품제안":
        return "var(--Primary-300)";
      case "병력대기":
        return "var(--Purple-300)";
      case "청약거절":
        return "var(--Danger-500)";
      case "상담거절":
        return "var(--Danger-300)";
      case "AS대상":
        return "var(--Gray-scale-300)";
      case "상담보류":
        return "var(--Success-300)";
      default:
        return "var(--Primary-50)";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "상품제안":
        return "var(--Primary-50)";
      case "병력대기":
        return "var(--Purple-50)";
      case "청약거절":
        return "var(--Danger-50)";
      case "상담거절":
        return "var(--Danger-50)";
      case "AS대상":
        return "var(--Secondary-50)";
      case "상담보류":
        return "var(--Success-50)";
      default:
        return "#fff";
    }
  };

  if (isLoading || !selectedCustomer) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <div className="text-center ">
      <div className="backpage flex items-center  ">
        <span
          className="mx-auto h-full w-[220px] cursor-pointer items-center"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            style={{ marginRight: "16px" }}
          />
          고객 관리 리스트로 돌아가기
        </span>
        <div class="h-full w-[842px]"></div>
      </div>
      <div class="flex h-[214px] w-full flex-row justify-center bg-LightMode-SectionBackground ">
        <div class="h-full w-full shadow-[0_1px_4px_0_rgba(0,0,0,0.05)]">
          <div class="mx-auto flex w-[1024px]">
            <div className="detailTitle flex items-center font-bold">
              기본정보
              <div class=" h-[20px] w-[20px] ">
                <img
                  className=" mb-0.5 ml-1 cursor-pointer pl-1 text-gray-400"
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
            <div class=" flex h-full w-[180px] items-center">
              <div class=" mr-[120px]">
                <div class="mb-3 flex h-[24px] w-[145px] items-center">
                  <div
                    class="mr-3 flex h-6 items-center text-[17px] font-semibold"
                    style={{ color: customerTypeColor }}
                  >
                    {customer.customerType.name}
                  </div>
                  <DropdownButtonWrapper>
                    <DropdownButton
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      style={{
                        borderColor: getStatusBorderColor(consultationStatus),
                        color: getStatusTextColor(consultationStatus),
                        backgroundColor: getStatusBgColor(consultationStatus),
                      }}
                    >
                      {consultationStatus}
                      {/* <img
                        src={isDropdownOpen ? upIcon : downIcon}
                        alt="icon"
                      /> */}
                    </DropdownButton>
                    {isDropdownOpen && (
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => handleStatusChange("상담보류")}
                        >
                          상담보류
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleStatusChange("상담거절")}
                        >
                          상담거절
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleStatusChange("상품제안")}
                        >
                          상품제안
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleStatusChange("병력대기")}
                        >
                          병력대기
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleStatusChange("청약거절")}
                        >
                          청약거절
                        </DropdownItem>

                        <DropdownItem
                          onClick={() => handleStatusChange("AS대상")}
                        >
                          AS 대상
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleStatusChange("상담 전")}
                        >
                          상담 전
                        </DropdownItem>
                      </DropdownMenu>
                    )}
                  </DropdownButtonWrapper>
                </div>
                <div style={{ cursor: "default" }}>
                  <div class="mb-1 flex text-xl font-bold text-LightMode-Text">
                    <div class="w-[60px] text-left">{customer.name}</div>
                    <div class="w-[90px] text-xl font-bold">
                      (만 {customer.age}세)
                    </div>
                  </div>
                  <div class="mb-1.5 flex w-[110px] items-center text-xs font-bold text-Primary-400">
                    {customer.work}
                  </div>
                  {customer.contractYn && (
                    <div class="mb-1.5 flex w-[110px] items-center text-xs font-bold text-Primary-400">
                      <img src={checkbox} class="mr-1 h-3 w-3" /> 계약완료고객
                    </div>
                  )}
                </div>
              </div>
              <div class="flex h-[212px] w-[543px] rounded-[10px] bg-white px-[18px] py-[32px] text-sm font-normal text-LightMode-Subtext shadow-[0_4px_8px_0_rgba(0,0,0,0.05)]">
                <div class="w-[250px] ">
                  <div class="flex">
                    <div class="mb-2 h-[30px] w-[70px]">생년월일 </div>
                    <span> : </span>
                    <span class="w-[175px]">{customer.birth}</span>
                  </div>
                  <div class="flex">
                    <div class="mb-2 h-[30px] w-[70px]">전화번호 </div>
                    <span> : </span>
                    <span class="w-[175px]">{customer.phone}</span>
                  </div>
                  <div class="flex">
                    <div class="mb-2 h-[30px] w-[70px]">평균소득 </div>
                    <span> : </span>
                    <span class="w-[175px]">{customer.salary} 만원</span>
                  </div>
                  <div class="flex">
                    <div class="h-[30px] w-[70px] ">상세주소 </div>
                    <span> : </span>
                    <span class="w-[175px] break-keep">
                      {customer.dongString}
                      {customer.address}
                    </span>
                  </div>
                </div>
                <div class="w-[250px]">
                  <div class="flex">
                    <div class="mb-2 h-[30px] w-[70px]">DB분배일 </div>
                    <span> : </span>
                    <span class="w-[175px]">{customer.registerDate}</span>
                  </div>
                  <div class="flex">
                    <div class="mb-2 h-[30px] w-[70px]">관심사항</div>
                    <span> : </span>
                    <span class="w-[175px]">{customer.worry}</span>
                  </div>
                  <div class="flex">
                    <div class="mb-2 h-[30px] w-[70px]">통화가능</div>
                    <span> : </span>
                    <span class="w-[175px]">{customer.workTime}</span>
                  </div>
                  <div class="flex">
                    <div class="h-[30px] w-[70px]">특이사항 </div>
                    <span> : </span>
                    <span class="w-[175px]">{customer.memo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DropdownButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  width: 60px;
  justify-content: space-between;
  padding: 3px 8px;
  border: 1px solid red;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 12px;
  justify-content: center;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: block;
  margin-bottom:2px;
  width: 100%
  padding: 2px 8px;
  font-size: 12px;
  text-align: center;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);

`;

const DropdownItem = styled.div`
  display: block;
  width: 100%;
  height:100%;
  padding: 4px 8px;
  font-weight: 400;
  border: 0;
  border-radius:4px
  cursor: pointer;
  &:hover {
    background-color: var(--LightMode-SectionBackground);
  }
`;

export default CustomerDetail;
