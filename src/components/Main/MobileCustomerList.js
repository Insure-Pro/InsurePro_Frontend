import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useCustomerTypes } from "../../hooks/CustomerTypes/useCustomerTypes";
import SkeletonMain from "../../Skeleton/SkeletonMain";

function MobileCustomerList({
  customers,
  handleCustomerClick,
  handleContextMenu,
  setContextMenu,
}) {
  const [consultationStatus, setConsultationStatus] = useState("상담 전");

  const mobileMenuIcon = process.env.PUBLIC_URL + "/mobileMenuIcon.png";
  const check_on = process.env.PUBLIC_URL + "/activate-check14.png";
  const check_off = process.env.PUBLIC_URL + "/deactivate-check14.png";
  const dropdown = process.env.PUBLIC_URL + "/dropdown.png";
  const dropup = process.env.PUBLIC_URL + "/dropup.png";

  useEffect(() => {
    if (customers) {
      const statusMap = customers.map((customer) => ({
        ...customer,
        consultationStatus: mapStatusToKorean(customer.consultationStatus),
      }));
      setConsultationStatus(statusMap);
    }
  }, [customers]);

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

  const getStatusTextColor = (status) => {
    switch (status) {
      case "PRODUCT_PROPOSAL":
        return "var(--Primary-500)";
      case "MEDICAL_HISTORY_WAITING":
        return "var(--Purple-500)";
      case "SUBSCRIPTION_REJECTION":
        return "var(--Danger-500)";
      case "CONSULTATION_REJECTION":
        return "var(--Danger-300)";
      case "AS_TARGET":
        return "var(--Gray-scale-500)";
      case "PENDING_CONSULTATION":
        return "var(--Success-500)";
      default:
        return "var(--Secondary-200)";
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case "PRODUCT_PROPOSAL":
        return "var(--Primary-300)";
      case "MEDICAL_HISTORY_WAITING":
        return "var(--Purple-300)";
      case "SUBSCRIPTION_REJECTION":
        return "var(--Danger-500)";
      case "CONSULTATION_REJECTION":
        return "var(--Danger-300)";
      case "AS_TARGET":
        return "var(--Gray-scale-300)";
      case "PENDING_CONSULTATION":
        return "var(--Success-300)";
      default:
        return "var(--Primary-50)";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "PRODUCT_PROPOSAL":
        return "var(--Primary-50)";
      case "MEDICAL_HISTORY_WAITING":
        return "var(--Purple-50)";
      case "SUBSCRIPTION_REJECTION":
        return "var(--Danger-50)";
      case "CONSULTATION_REJECTION":
        return "var(--Danger-50)";
      case "AS_TARGET":
        return "var(--Secondary-50)";
      case "PENDING_CONSULTATION":
        return "var(--Success-50)";
      default:
        return "#fff";
    }
  };

  // 현재 열린 ContextMenu의 고객을 추적하는 상태 변수 추가
  const [currentOpenedMenuCustomer, setCurrentOpenedMenuCustomer] =
    useState(null);

  // 상세 정보 토글 상태를 추적하는 상태 변수 추가
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  // 모바일에서 컨텍스트 메뉴를 표시하는 함수
  const handleMobileContextMenu = (e, customer) => {
    e.preventDefault();
    e.stopPropagation();
    // 만약 현재 클릭된 고객의 메뉴가 이미 열려있다면, 메뉴를 닫습니다.
    if (currentOpenedMenuCustomer === customer.pk) {
      setContextMenu({ visible: false }); // ContextMenu를 닫음
      setCurrentOpenedMenuCustomer(null); // 현재 열린 메뉴 상태를 초기화
    } else {
      // 모바일 환경에서는 pageX와 pageY를 사용할 수 없으므로, 대체 방법 사용
      setContextMenu({
        visible: !false,
        xPos: e.currentTarget.offsetLeft,
        yPos: e.currentTarget.offsetTop + e.currentTarget.offsetHeight,
        customer: customer,
      });
      setCurrentOpenedMenuCustomer(customer.pk); // 현재 열린 메뉴의 고객 상태를 업데이트
    }
  };

  // Assuming you have a hook to fetch customer types including colors
  const { data: customerTypes, isLoading } = useCustomerTypes();

  // Function to find color by customer type name
  const getColorByTypeName = (typeName) => {
    const type = customerTypes?.find((t) => t.name === typeName);
    return type ? type.color : "black"; // Replace 'defaultColor' with a default color of your choice
  };

  if (customers.length === 0) {
    return <p className="mb-1 mt-3">일치하는 고객이 없습니다.</p>;
  }

  // 상세 정보 토글 핸들러 함수
  const handleToggleDetails = (customerPk) => {
    if (expandedCustomer === customerPk) {
      setExpandedCustomer(null); // 토글 닫기
    } else {
      setExpandedCustomer(customerPk); // 토글 열기
    }
  };

  return (
    <>
      {isLoading ? (
        <div class="flex w-full justify-center">
          <div
            class={`sm:[380px] mx-4 grid h-full gap-1 xsm:grid-cols-2 xsm:gap-1 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 md:gap-3 `}
          >
            <SkeletonMain />
            <SkeletonMain />
            <SkeletonMain />
            <SkeletonMain />
            <SkeletonMain />
            <SkeletonMain />
            <SkeletonMain />
            <SkeletonMain />
            <SkeletonMain />
            <SkeletonMain />
            <SkeletonMain />
            <SkeletonMain />
          </div>
        </div>
      ) : (
        <>
          <div class=" flex w-full justify-center">
            <div
              class={`sm:[380px] mx-4 grid h-full gap-2 xsm:grid-cols-1 xsm:gap-2 sm:grid-cols-2 sm:gap-2 md:grid-cols-2 md:gap-3 `}
            >
              {customers
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((customer) => (
                  <div key={customer.pk} data-id={customer.pk} className="  ">
                    <ListGroup
                      key={customer.pk}
                      // onClick={() => handleCustomerClick(customer)}
                    >
                      <div class="">
                        <div
                          className={`customerCardWrapper h-auto w-[328px] rounded-2xl border ${
                            customer.contractYn
                              ? " border-Primary-400"
                              : " border-Accent-Separator"
                          } bg-white p-4`}
                          onClick={() => handleCustomerClick(customer)}
                        >
                          <div class="mb-2 flex justify-between">
                            <div class="flex">
                              <button
                                style={{
                                  backgroundColor: getColorByTypeName(
                                    customer.customerType.name,
                                  ),
                                }}
                                key={customer.pk}
                                class="mr-1 flex h-5 w-6 items-center justify-center rounded"
                              >
                                <div class="text-[10px] font-normal text-white">
                                  {customer.customerType.name}
                                </div>
                              </button>
                              <button
                                class="flex h-5 w-[44px] items-center justify-center rounded border"
                                style={{
                                  borderColor: getStatusBorderColor(
                                    customer.consultationStatus,
                                  ),
                                  color: getStatusTextColor(
                                    customer.consultationStatus,
                                  ),
                                  backgroundColor: getStatusBgColor(
                                    customer.consultationStatus,
                                  ),
                                }}
                              >
                                <span class="text-[10px] font-normal">
                                  {mapStatusToKorean(
                                    customer.consultationStatus,
                                  )}
                                </span>
                              </button>
                            </div>
                            <div
                              class=" h-5 w-5 cursor-pointer"
                              onClick={(e) =>
                                handleMobileContextMenu(e, customer)
                              }
                            >
                              <img src={mobileMenuIcon} />
                            </div>
                          </div>
                          <div class="mb-1 flex items-center text-sm text-LightMode-Text">
                            <div class="mr-0.5"> {customer.name}</div>{" "}
                            <div class="mr-1.5"> ({customer.age})</div>
                            {customer.gender === "MALE" && (
                              <div class="mr-2 h-5 w-[26px] rounded bg-[#CCE5FF] text-[10px] text-[#148AFF]">
                                남성
                              </div>
                            )}
                            {customer.gender === "FEMALE" && (
                              <div class="mr-2 h-5 w-[26px] rounded bg-[#FFD6E0] text-[10px] text-[#FF527D]">
                                여성
                              </div>
                            )}
                            {(customer.gender === "OTHER" ||
                              !customer.gender ||
                              customer.gender.trim() === "") && (
                              <div class="mr-2 h-5 w-[26px] rounded bg-[#F1F2F4] text-[10px] text-[#737A8C]">
                                성별
                              </div>
                            )}
                            {customer.contractYn ? (
                              <img class=" h-[14px] w-[14px] " src={check_on} />
                            ) : (
                              <img class="h-[14px] w-[14px]" src={check_off} />
                            )}
                          </div>

                          <div class="mb-2 flex text-xs text-LightMode-Subtext">
                            {customer.phone}
                          </div>
                          <hr class="py-2" />
                          <div class="flex">
                            <div class="w-[144px]">
                              <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                                생년월일 : {customer.birth}{" "}
                              </div>
                              <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                                <p class="truncate">
                                  거주지 : {customer.dongString}
                                </p>
                              </div>
                              <div class="flex text-[10px] font-normal text-Secondary-300">
                                <p class="truncate">
                                  상세주소 :{customer.address}{" "}
                                </p>
                              </div>
                            </div>
                            <div class="w-[144px]">
                              <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                                직업 : {customer.work}{" "}
                              </div>
                              <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                                <p class="truncate">
                                  소득 : {customer.salary} 만원
                                </p>
                              </div>
                              <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                                <p class="truncate">
                                  통화 시간 :{customer.workTime}{" "}
                                </p>
                              </div>
                            </div>
                          </div>
                          {expandedCustomer === customer.pk && (
                            <div
                              className="flex h-[125px] w-[296px] flex-col justify-center bg-[#F6F7F8] px-3 py-2 text-[10px] font-normal text-Secondary-300"
                              onClick={(e) => {
                                e.stopPropagation(); // Stop event propagation to prevent parent click
                                handleToggleDetails(customer.pk);
                              }}
                            >
                              <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                                DB 분배일 : {customer.registerDate}
                              </div>
                              <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                                고민 : {customer.worry}
                              </div>
                              <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                                인수상태 : {customer.state}
                              </div>
                              <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                                특이사항 : {customer.memo}
                              </div>
                              <hr class="py-2" />
                              <div class="flex items-center justify-center">
                                <button>정보 간단하게 보기</button>
                                <img
                                  className="ml-2 h-2 w-4"
                                  src={dropup}
                                  alt="Dropup"
                                />
                              </div>
                            </div>
                          )}
                          {expandedCustomer !== customer.pk && (
                            <div
                              className="flex h-8 w-[296px] items-center justify-center bg-[#F6F7F8] text-[10px] font-normal text-Secondary-300"
                              onClick={(e) => {
                                e.stopPropagation(); // Stop event propagation to prevent parent click
                                handleToggleDetails(customer.pk);
                              }}
                            >
                              <button>정보 자세히 보기</button>
                              <img
                                className="ml-2 h-2 w-4"
                                src={dropdown}
                                alt="Dropdown"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </ListGroup>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default MobileCustomerList;
