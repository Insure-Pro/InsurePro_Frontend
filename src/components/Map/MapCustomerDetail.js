import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import CloseButton from "react-bootstrap/CloseButton";
import { useCustomerTypes } from "../../hooks/CustomerTypes/useCustomerTypes";

const MapCustomerDetail = ({ customerPk, onClose }) => {
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

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
        top: 0,
        width: "300px",
        height: "100%",
        backgroundColor: "#fff",
        zIndex: 5, // Ensure it's above other elements
        borderLeft: "2px solid #dde1e6",
      }}
    >
      <div class="flex h-[80px] items-center bg-LightMode-SectionBackground py-7 pl-6 pr-4">
        <div
          class="pr-2 text-[15px] font-bold text-secondary-100"
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
        <div class="flex flex-col ">
          {/* 체크박스 추가 */}
          <div class="ml-1 flex">
            <input
              type="checkbox"
              id="customCheckbox"
              className="hidden-checkbox"
              checked={customerData.contractYn}
              readOnly
            />
            <label htmlFor="customCheckbox" class="checkbox-label"></label>
            <div
              class={` mb-[7px] ml-1 text-left text-[8px] ${
                customerData.contractYn
                  ? "text-Primary-300"
                  : "text-LightMode-Text"
              }`}
            >
              계약완료고객
            </div>
          </div>
          <div class="flex">
            <div class=" w-[44px] text-[15px] font-bold">
              {customerData.name}
            </div>
            <div class=" w-[58px] pl-1 text-[13px]">
              (만 {customerData.age}세)
            </div>
          </div>
        </div>
        <div
          onClick={() => handleCustomerClick(customerData)}
          class="flex w-[130px] items-center pl-[24px] text-[10px] text-gray-150"
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
      <div class="flex h-10 text-xs font-medium  text-gray-50">
        <div
          className={`px-[51px] py-3 ${
            activeTab === "고객 정보"
              ? "border-b-2 border-b-primary-100 font-semibold text-primary-100"
              : ""
          }`}
          onClick={() => handleTabClick("고객 정보")}
        >
          고객 정보
        </div>
        <div
          className={`px-[54px] py-3 ${
            activeTab === "히스토리"
              ? "border-b-2 border-b-primary-100 font-semibold text-primary-100"
              : ""
          }`}
          onClick={() => handleTabClick("히스토리")}
        >
          히스토리
        </div>
      </div>
      <hr style={{ margin: "0px" }} />
      {activeTab === "고객 정보" && (
        <div class="customer-info-wrapper text-xs  ">
          <div class="flex items-center ">
            <div class="flex h-[33px] w-[104px] items-center pl-6 text-left font-semibold">
              주소
            </div>
            <div>{customerData.dongString}</div>
          </div>
          <div class="flex items-center  bg-LightMode-SectionBackground ">
            <div class="flex h-[33px] w-[104px] items-center pl-6 text-left font-semibold">
              전화번호
            </div>
            <div>{customerData.phone}</div>
          </div>
          <div class="flex items-center ">
            <div class="flex h-[33px] w-[104px] items-center pl-6 text-left font-semibold">
              생년월일
            </div>
            <div>{customerData.birth}</div>
          </div>
          <div class="flex items-center  bg-LightMode-SectionBackground ">
            <div class="flex h-[33px] w-[104px] items-center pl-6 text-left font-semibold">
              DB 분배일
            </div>
            <div>{customerData.registerDate}</div>
          </div>
          <div class="flex items-center ">
            <div class="flex h-[33px] w-[104px] items-center pl-6 text-left font-semibold">
              인수상태
            </div>
            <div>{customerData.state}</div>
          </div>
          <div class="flex items-center  bg-LightMode-SectionBackground  ">
            <div class="flex h-[33px] w-[104px] items-center pl-6 text-left font-semibold">
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

export default MapCustomerDetail;
