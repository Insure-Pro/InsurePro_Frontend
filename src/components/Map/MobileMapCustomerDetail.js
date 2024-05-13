import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import CloseButton from "react-bootstrap/CloseButton";
import { useCustomerTypes } from "../../hooks/CustomerTypes/useCustomerTypes";

const MobileMapCustomerDetail = ({ customerPk, onClose }) => {
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;
  const mobileModalTop = process.env.PUBLIC_URL + "/Mobile_modal_top.png";
  const [customerData, setCustomerData] = useState("");
  const [scheduleData, setScheduleData] = useState("");

  const [activeTab, setActiveTab] = useState("고객 정보"); // Default to '고객 정보'
  const { data: customerTypes, isLoading } = useCustomerTypes();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const right = process.env.PUBLIC_URL + "/Right.png";

  const navigate = useNavigate();

  const handleCustomerClick = (customer) => {
    navigate("/detail", { state: { customerPk: customer.pk } });
  };

  useEffect(() => {
    if (customerPk) {
      axios
        .get(`${MAIN_URL}/customer/${customerPk}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => setCustomerData(response.data))
        .catch((error) =>
          console.error("Error fetching customer data:", error),
        );

      axios
        .get(`${MAIN_URL}/schedules/${customerPk}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => setScheduleData(response.data))
        .catch((error) =>
          console.error("Error fetching schedule data:", error),
        );
    }
  }, [customerPk]);

  if (!customerPk) return null;

  const getColorByTypeName = (typeName) => {
    const type = customerTypes?.find((t) => t.name === typeName);
    return type ? type.color : "black"; // Replace 'defaultColor' with a default color of your choice
  };

  const progressTypeColors = {
    TA: "var(--Success-200)",
    AP: "var(--Success-300)",
    PC: "var(--Success-500)",
    ST: "var(--Success-700)",
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "60%",
        backgroundColor: "#fff",
        zIndex: 5, // Ensure it's above other elements
        borderLeft: "2px solid #dde1e6",
      }}
    >
      <div class="bg-LightMode-SectionBackground" onClick={onClose}>
        <div class="flex  w-full justify-center py-2">
          {/* <img src={mobileModalTop} class="h-1 w-[110px]" /> */}
          <hr class="h-1 w-[110px] rounded-lg bg-gray-500" />
        </div>
        {/* <div class="flex h-9 justify-between px-8 text-sm">
          <div class="font-normal text-Primary-400">취소</div>
          <div class="font-bold text-Gray-scale-400">완료</div>
        </div> */}
      </div>
      <div class="flex w-full justify-center  bg-LightMode-SectionBackground">
        <div class="flex h-[80px] items-center py-5 pl-[48px] pr-4">
          <div class="mb-2.5 mr-2 flex h-10 w-10 flex-col justify-center">
            <div
              class="text-base font-bold"
              style={{
                color: customerData.customerType
                  ? getColorByTypeName(customerData.customerType.name)
                  : "black",
              }}
            >
              {customerData.customerType
                ? customerData.customerType.name
                : "Loading..."}
            </div>
            <button class="flex h-[12px] w-[38px] items-center justify-center rounded border border-Warning-500 text-[8px] font-normal text-Warning-500">
              상담보류
            </button>
          </div>
          <div class="flex flex-col ">
            {/* 체크박스 추가 */}
            <div class="mb-1 ml-1 flex items-center">
              <input
                type="checkbox"
                id="customCheckbox"
                className="hidden-checkbox"
                checked={customerData.contractYn}
                readOnly
              />
              <label htmlFor="customCheckbox" class="checkbox-label"></label>
              <div
                class={` ml-1 text-left text-[8px] ${
                  customerData.contractYn
                    ? "text-Primary-300"
                    : "text-LightMode-Text"
                }`}
              >
                계약완료고객
              </div>
            </div>
            <div class="flex">
              <div class=" w-[44px] text-base font-normal">
                {customerData.name}
              </div>
              <div class=" w-[70px] pl-1 text-base font-normal">
                (만 {customerData.age}세)
              </div>
            </div>
          </div>
          <div
            onClick={() => handleCustomerClick(customerData)}
            class="ml-[54px] flex w-[130px] items-center text-[10px] text-gray-150"
          >
            상세정보 바로가기 <img src={right} class="h-4 w-4" />
          </div>
          <CloseButton
            onClick={onClose}
            style={{
              marginLeft: "auto",
              paddingRight: "8px",
            }}
          />
        </div>
      </div>
      <div class="flex h-10 text-sm font-medium  text-gray-50">
        <div
          className={`w-1/2 px-[51px] py-3 ${
            activeTab === "고객 정보"
              ? "border-b-2 border-b-primary-100 font-semibold text-primary-100"
              : "mb-[2px] bg-Secondary-50/60"
          }`}
          onClick={() => handleTabClick("고객 정보")}
        >
          고객 정보
        </div>
        <div
          className={`w-1/2 px-[54px] py-3 ${
            activeTab === "히스토리"
              ? "border-b-2 border-b-primary-100 font-semibold text-primary-100"
              : "mb-[2px] bg-Secondary-50/60"
          }`}
          onClick={() => handleTabClick("히스토리")}
        >
          히스토리
        </div>
      </div>
      <hr style={{ margin: "0px" }} />
      {activeTab === "고객 정보" && (
        <div class="customer-info-wrapper mt-2 text-xs ">
          <div class="mb-1 flex items-center border-b border-Secondary-50 pl-10">
            <div class="flex h-[33px] w-[90px] items-center  text-left font-normal">
              주소
            </div>
            <div>{customerData.dongString}</div>
          </div>
          <div class=" mb-1 flex items-center border-b border-Secondary-50 pl-10 ">
            <div class="flex h-[33px] w-[90px] items-center text-left font-normal">
              전화번호
            </div>
            <div>{customerData.phone}</div>
          </div>
          <div class="flex items-center border-b border-Secondary-50 pl-10 ">
            <div class="flex h-[33px] w-[90px] items-center text-left font-normal">
              생년월일
            </div>
            <div>{customerData.birth}</div>
          </div>
          <div class="mb-1 flex items-center border-b border-Secondary-50 pl-10 ">
            <div class="flex h-[33px] w-[90px] items-center text-left font-normal">
              DB 분배일
            </div>
            <div>{customerData.registerDate}</div>
          </div>
          <div class="flex items-center border-b border-Secondary-50 pl-10 ">
            <div class="flex h-[33px] w-[90px] items-center text-left font-normal">
              인수상태
            </div>
            <div>{customerData.state}</div>
          </div>
          <div class="mb-1 flex items-center  border-b border-Secondary-50 pl-10 ">
            <div class="flex h-[33px] w-[90px] items-center text-left font-normal">
              특이사항
            </div>
            <div>{customerData.memo}</div>
          </div>
        </div>
      )}
      {activeTab === "히스토리" &&
        scheduleData &&
        scheduleData.map((schedule, index) => (
          <div className="MapCustomerDetail_item_container" key={index}>
            <div class="flex items-center ">
              <div
                style={{
                  color: progressTypeColors[schedule.progress],
                }}
                class="w-[88px] text-sm font-semibold"
              >
                {schedule.progress}
              </div>
            </div>
            <div class=" text-left">
              <div class="flex w-[212px]">
                <div class="mb-1 w-[82px] font-semibold ">{schedule.date}</div>
                <div class=" w-[128px] overflow-hidden overflow-ellipsis whitespace-nowrap ">
                  {schedule.address}
                </div>
              </div>
              <div class="text-[10px]">{schedule.memo}</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MobileMapCustomerDetail;
