import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../pages/Navbar";
import DateChangeAModal from "../components/DateChangeAModal";

import ApGraph from "../components/Graph/ApGraph";
import TaGraph from "../components/Graph/TaGraph";
import PcGraph from "../components/Graph/PcGraph";
import ContractGraph from "../components/Graph/ContractGraph";
import { Colors } from "chart.js";

const Analysis = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [showModal, setShowModal] = useState(false);

  const [date, setDate] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}-01`
  );
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const customerTypes = ["OD", "AD", "CD", "CP", "JD"];

  const navigate = useNavigate();
  // Function to format the date for display

  const currentDate = new Date(); // 현재 날짜를 얻습니다.
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const formattedDate1 = `${selectedYear}-${String(selectedMonth).padStart(
    2,
    "0"
  )}`; // formattedDate 업데이트
  const formattedDate = () =>
    `${year}년 ${month.toString().padStart(2, "0")}월`;

  // Function to handle date changes from the modal
  const handleDateChange = (newYear, newMonth) => {
    setYear(newYear);
    setMonth(newMonth);
    const formattedDate2 = `${newYear}-${String(newMonth).padStart(2, "0")}-01`;
    setDate(formattedDate2);
    setShowModal(false); // Close modal after date change
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all(
          customerTypes.map((customerType) =>
            fetch(
              `https://www.insurepro.kro.kr/v1/analysis?date=${date}&customerType=${customerType}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            ).then((response) => response.json())
          )
        );

        // Map responses to an object with customerType keys
        const newData = responses.reduce((acc, response, index) => {
          acc[customerTypes[index]] = response;
          return acc;
        }, {});

        setData(newData);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [date]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(data);
  console.log(date);

  const allTaCount =
    data["OD"]?.ta +
    data["AD"]?.ta +
    data["CD"]?.ta +
    data["CP"]?.ta +
    data["JD"]?.ta;
  const allApCount =
    data["OD"]?.ap +
    data["AD"]?.ap +
    data["CD"]?.ap +
    data["CP"]?.ap +
    data["JD"]?.ap;
  const allPcCount =
    data["OD"]?.pc +
    data["AD"]?.pc +
    data["CD"]?.pc +
    data["CP"]?.pc +
    data["JD"]?.pc;
  const allContractCount =
    data["OD"]?.subscriptionCount +
    data["AD"]?.subscriptionCount +
    data["CD"]?.subscriptionCount +
    data["CP"]?.subscriptionCount +
    data["JD"]?.subscriptionCount;

  const handleMonthCustomersClick = () => {
    navigate("/main", { state: { selectedTab: "월별 고객", formattedDate1 } });
  };

  const handleAllCustomersClick = () => {
    navigate("/main", { state: { selectedTab: "전체" } });
  };

  const handleContractCompleteClick = () => {
    navigate("/main", { state: { selectedTab: "계약완료고객" } });
  };

  return (
    <div
      className="Detail_container"
      style={{
        display: "flex",
        backgroundColor: "#F5FAFF",
        width: "1400px",
        margin: "0 auto",
        backgroundColor: "#fff",
        // borderRight: "2px solid #dde1e6",
      }}
    >
      <Navbar
        onContractCompleteClick={handleContractCompleteClick}
        onAllCustomersClick={handleAllCustomersClick}
        onMonthCustomersClick={handleMonthCustomersClick}
        ContractedCustomerClcik={handleContractCompleteClick}
        AllCustomersClick={handleAllCustomersClick}
      />
      <div
        className="analysis_container"
        style={{
          marginLeft: "52px",
          height: "100vh",
          userSelect: "none",
          borderRight: "2px solid #dde1e6",
        }}
      >
        <div className="analysis_header maintitle">성과분석</div>
        <div
          className="analysis_subtitle_left"
          onClick={() => setShowModal(true)}
        >
          <div>{formattedDate()}</div>
        </div>
        <div className="analysis_subtitle">
          <span>총 TA 개수 : {allTaCount}</span>
          <span>AP 개수: {allApCount}</span>
          <span>PC 개수: {allPcCount}</span>
          <span> 청약 건수: {allContractCount}</span>
        </div>
        <div
          className="analysis_explain"
          style={{
            fontWeight: "normal",
            color: "#475467",
            backgroundColor: "#F5FAFF",
            // fontWeight: "bold",
          }}
        >
          <div className="analysis_explain_item">
            <span className="explain_item_title">TA 확률 </span>
            <span>:</span>
            {"     "}
            <span> TA 갯수/ 이번달 분배받은 db고객 수 기준</span>
          </div>
          <div className="analysis_explain_item">
            <span className="explain_item_title">AP 확률 </span> <span>:</span>
            <span> AP 갯수/ 이번달 분배받은 db고객 수 기준</span>
          </div>
          <div className="analysis_explain_item">
            <span className="explain_item_title">PC 확률 </span> <span>:</span>
            <span> PC 갯수/ 이번달 분배받은 db고객 수 기준</span>
          </div>
          <div className="analysis_explain_item">
            <span className="explain_item_title">청약 건수 </span>{" "}
            <span>:</span>
            <span> 청약 건수/ 이번달 분배받은 db고객 수 기준</span>
          </div>
        </div>
        <div className="analysis_graph1">
          <span
            style={{
              fontSize: "16px",
              display: "flex",
              alignItems: "start",
              paddingLeft: "18px",
              paddingTop: "16px",
              marginBottom: "-8px",
            }}
          >
            Ta 확률
          </span>
          <div
            className="Ta_ratio_item"
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
              fontSize: "14px",
              marginRight: "22px",
            }}
          >
            <span>{Math.round(data["OD"]?.taratio * 100)}%</span>
            <span>{Math.round(data["AD"]?.taratio * 100)}%</span>
            <span>{Math.round(data["CD"]?.taratio * 100)}%</span>
            <span>{Math.round(data["CP"]?.taratio * 100)}%</span>
            <span>{Math.round(data["JD"]?.taratio * 100)}%</span>
          </div>
          <TaGraph
            data={{
              OD: data["OD"]?.taratio,
              AD: data["AD"]?.taratio,
              CD: data["CD"]?.taratio,
              CP: data["CP"]?.taratio,
              JD: data["JD"]?.taratio,
            }}
          />
        </div>
        <div className="analysis_graph2">
          <span
            style={{
              fontSize: "16px",
              display: "flex",
              alignItems: "start",
              paddingLeft: "18px",
              paddingTop: "16px",
              marginBottom: "-8px",
            }}
          >
            AP 확률
          </span>
          <div
            className="Ta_ratio_item"
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
              fontSize: "14px",
              marginRight: "22px",
            }}
          >
            <span>{Math.round(data["OD"]?.apratio * 100)}%</span>
            <span>{Math.round(data["AD"]?.apratio * 100)}%</span>
            <span>{Math.round(data["CD"]?.apratio * 100)}%</span>
            <span>{Math.round(data["CP"]?.apratio * 100)}%</span>
            <span>{Math.round(data["JD"]?.apratio * 100)}%</span>
          </div>
          <ApGraph
            data={{
              OD: data["OD"]?.apratio,
              AD: data["AD"]?.apratio,
              CD: data["CD"]?.apratio,
              CP: data["CP"]?.apratio,
              JD: data["JD"]?.apratio,
            }}
          />
        </div>
        <div className="analysis_graph3">
          <span
            style={{
              fontSize: "16px",
              display: "flex",
              alignItems: "start",
              paddingLeft: "18px",
              paddingTop: "16px",
              marginBottom: "-8px",
            }}
          >
            PC 확률
          </span>
          <div
            className="Ta_ratio_item"
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
              fontSize: "14px",
              marginRight: "22px",
            }}
          >
            <span>{Math.round(data["OD"]?.pcratio * 100)}%</span>
            <span>{Math.round(data["AD"]?.pcratio * 100)}%</span>
            <span>{Math.round(data["CD"]?.pcratio * 100)}%</span>
            <span>{Math.round(data["CP"]?.pcratio * 100)}%</span>
            <span>{Math.round(data["JD"]?.pcratio * 100)}%</span>
          </div>
          <PcGraph
            data={{
              OD: data["OD"]?.pcratio,
              AD: data["AD"]?.pcratio,
              CD: data["CD"]?.pcratio,
              CP: data["CP"]?.pcratio,
              JD: data["JD"]?.pcratio,
            }}
          />
        </div>
        <div className="analysis_graph4">
          <span
            style={{
              fontSize: "16px",
              display: "flex",
              alignItems: "start",
              paddingLeft: "28px",
              paddingTop: "16px",
              marginBottom: "-8px",
            }}
          >
            청약 건수
          </span>
          <ContractGraph
            data={{
              OD: data["OD"]?.subscriptionCount,
              AD: data["AD"]?.subscriptionCount,
              CD: data["CD"]?.subscriptionCount,
              CP: data["CP"]?.subscriptionCount,
              JD: data["JD"]?.subscriptionCount,
            }}
          />
        </div>
        <div className="updateMessage">
          2023년 11월 10일에 마지막으로 업데이트 되었습니다.{" "}
        </div>
      </div>
      {/* DateChangeModal component */}
      {showModal && (
        <DateChangeAModal
          initialYear={year}
          initialMonth={month}
          onDateChange={handleDateChange}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Analysis;