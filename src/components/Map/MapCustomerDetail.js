import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import CloseButton from "react-bootstrap/CloseButton";
import { customerTypeColors } from "../../constants/customerTypeColors";

const MapCustomerDetail = ({ customerPk, onClose }) => {
  const MAIN_URL = process.env.REACT_APP_MAIN_URL;

  const [customerData, setCustomerData] = useState("");
  const [scheduleData, setScheduleData] = useState("");

  const [activeTab, setActiveTab] = useState("고객 정보"); // Default to '고객 정보'

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

  const progressTypeColors = {
    TA: "var(--Success-200)",
    AP: "var(--Success-300)",
    PT: "var(--Success-500)",
    PC: "var(--Success-700)",
  };

  const progressTypeWidth = {
    TA: "6px",
    AP: "12px",
    PT: "18px",
    PC: "24px",
  };

  const progressTypeGradient = {
    TA: "linear-gradient(270deg, #34A853 2.22%, #77C58C 52.58%, #A2D7B0 100%)",
    AP: "linear-gradient(270deg, #77C58C 0%, #AEDCBA 100%)",
    PT: "linear-gradient(270deg, #34A853 2.22%, #77C58C 52.58%, #A2D7B0 100%)",
    PC: "linear-gradient(270deg, rgba(37, 119, 59, 0.80) 0.06%, rgba(52, 168, 83, 0.80) 32.96%, rgba(119, 197, 140, 0.80) 64.39%, rgba(162, 215, 176, 0.80) 98.27%) ",
  };

  return (
    <div
      className=""
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
      <div class="flex h-[80px] items-center bg-LightMode-SectionBackground px-6 py-7">
        <div
          class="pr-2 text-[15px] font-bold text-secondary-100"
          style={{
            color: customerTypeColors[customerData.customerType],
          }}
        >
          {customerData.customerType}
        </div>
        <div class="flex flex-col ">
          {/* 체크박스 추가 */}
          <div class="flex">
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
            <div class=" text-[15px] font-bold">{customerData.name}</div>
            <div class=" pl-1 text-[13px]">(만 {customerData.age}세)</div>
          </div>
        </div>
        <div
          onClick={() => handleCustomerClick(customerData)}
          class="flex items-center pl-[30px] text-[10px] text-gray-150"
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
            <div class="flex flex-col items-center ">
              <div
                style={{
                  color: progressTypeColors[schedule.progress],
                }}
                class="w-[88px] text-sm font-semibold"
              >
                {schedule.progress}
              </div>
              <div class="mt-1 h-[5px] w-[24px] rounded-lg bg-white">
                <div
                  class="h-[5px] rounded-lg"
                  style={{
                    background: progressTypeGradient[schedule.progress],
                    width: progressTypeWidth[schedule.progress],
                  }}
                ></div>
              </div>
            </div>
            <div class=" text-left">
              <div class="flex w-[212px]">
                <div class="mb-1 w-[72px] font-semibold ">{schedule.date}</div>
                <div class=" w-[140px] overflow-hidden overflow-ellipsis whitespace-nowrap ">
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
