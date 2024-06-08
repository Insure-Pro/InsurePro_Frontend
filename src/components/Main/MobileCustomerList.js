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
  const mobileMenuIcon = process.env.PUBLIC_URL + "/mobileMenuIcon.png";
  const check_on = process.env.PUBLIC_URL + "/activate-check14.png";
  const check_off = process.env.PUBLIC_URL + "/deactivate-check14.png";
  // 현재 열린 ContextMenu의 고객을 추적하는 상태 변수 추가
  const [currentOpenedMenuCustomer, setCurrentOpenedMenuCustomer] =
    useState(null);

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
              class={`sm:[380px] mx-4 grid h-full gap-1 xsm:grid-cols-2 xsm:gap-1 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 md:gap-3 `}
            >
              {customers
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((customer) => (
                  <div key={customer.pk} data-id={customer.pk} className="  ">
                    <ListGroup
                      key={customer.pk}
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <div class="">
                        <div
                          className={`customerCardWrapper h-[122px] w-[162px] rounded border ${
                            customer.contractYn
                              ? " border-Primary-400"
                              : " border-black/50"
                          } bg-white py-3 pl-4 pr-2`}
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
                                class="mr-1 flex h-4 w-6 items-center justify-center rounded"
                              >
                                <div class="text-[10px] font-normal text-white">
                                  {customer.customerType.name}
                                </div>
                              </button>
                              <button class="flex h-4 w-[44px] items-center justify-center rounded border border-Success-300 bg-Success-50">
                                <span class="text-[10px] font-normal text-Success-300">
                                  상담현황
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
                            {customer.contractYn ? (
                              <img class=" h-[14px] w-[14px] " src={check_on} />
                            ) : (
                              <img class="h-[14px] w-[14px]" src={check_off} />
                            )}
                          </div>

                          <div class="mb-2 flex text-xs text-LightMode-Subtext">
                            {customer.phone}
                          </div>
                          <div class="mb-2 flex text-[10px] font-normal text-Secondary-300">
                            분배일 : {customer.registerDate}{" "}
                          </div>
                          <div class="flex text-[10px] font-normal text-Secondary-300">
                            <p class="truncate">
                              주소 : {customer.dongString}
                              {customer.address}{" "}
                            </p>
                          </div>
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
