import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

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

  return (
    <div
      className=""
      style={{
        position: "absolute",
        // left: "300px", // Adjust based on the width of the Map_customerList_container
        top: 0,
        width: "300px",
        height: "100%",
        backgroundColor: "#fff",
        zIndex: 2, // Ensure it's above other elements
        borderLeft: "2px solid #dde1e6",
      }}
    >
      <div class="flex h-[80px] items-center bg-gray-100 px-6 py-7">
        <div class="text-secondary-100 pr-2 text-[15px] font-bold">
          {customerData.customerType}
        </div>
        <div class=" text-[15px] font-bold">{customerData.name}</div>
        <div class=" pl-1 text-[13px]">(만 {customerData.age}세)</div>
        <div
          onClick={() => handleCustomerClick(customerData)}
          class="flex pl-[30px] text-[10px] text-gray-150"
        >
          상세정보 바로가기 <img src={right} class="h-4 w-4" />
        </div>
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",

            cursor: "default",
          }}
        >
          <h7 style={{ marginBottom: "-4px" }}>
            <Form.Check
              className="Detail_checkbox"
              aria-label="option 1"
              checked={customerData.contractYn || false}
              readOnly
              style={{ marginLeft: "8px", marginTop: "-4px" }}
            />
          </h7>
        </div> */}
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
          <div class="flex items-center bg-gray-100 ">
            <div class="flex h-[33px] w-[104px] items-center pl-6 text-left font-semibold">
              생년월일
            </div>
            <div>{customerData.birth}</div>
          </div>
          <div class="flex items-center ">
            <div class="flex h-[33px] w-[104px] items-center pl-6 text-left font-semibold">
              DB 분배일
            </div>
            <div>{customerData.registerDate}</div>
          </div>
          <div class="flex items-center  bg-gray-100  ">
            <div class="flex h-[33px] w-[104px] items-center pl-6 text-left font-semibold">
              인수상태
            </div>
            <div>{customerData.state}</div>
          </div>
          <div class="flex items-center ">
            <div class="flex h-[33px] w-[104px] items-center pl-6 text-left font-semibold">
              특이사항
            </div>
            <div>{customerData.memo}</div>
          </div>
        </div>
      )}
      {/* <hr style={{ margin: "0px", marginBottom: "10px" }} /> */}
      {activeTab === "히스토리" &&
        scheduleData &&
        scheduleData.map((schedule, index) => (
          <div className="MapCustomerDetail_item_container" key={index}>
            <div class="w-[88px]">{schedule.progress}</div>
            <div class=" text-left">
              <div class="flex w-[212px]">
                <div class="mb-1 w-[72px] font-semibold ">{schedule.date}</div>
                <div class="text-overflow-ellipsis   w-[140px]   overflow-hidden   overflow-ellipsis whitespace-nowrap ">
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
