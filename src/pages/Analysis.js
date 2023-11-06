import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../pages/Navbar";
import DateChangeModal from "../components/DateChangeModal";

import ApGraph from "../components/Graph/ApGraph";
import TaGraph from "../components/Graph/TaGraph";
import PcGraph from "../components/Graph/PcGraph";
import ContractGraph from "../components/Graph/ContractGraph";
import { Colors } from "chart.js";

const Analysis = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [showModal, setShowModal] = useState(false);

  // Function to format the date for display
  const formattedDate = () =>
    `${year}년 ${month.toString().padStart(2, "0")}월`;

  // Function to handle date changes from the modal
  const handleDateChange = (newYear, newMonth) => {
    setYear(newYear);
    setMonth(newMonth);
    setShowModal(false); // Close modal after date change
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
      <Navbar />
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
          <span>총 TA 개수 : 00</span>
          <span>AP 개수: 00</span>
          <span>PC 개수: 00</span>
          <span> 청약 건수: 00</span>
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
            <span>36%</span>
            <span>52%</span>
            <span>14%</span>
            <span>24%</span>
            <span>6%</span>
          </div>
          <TaGraph />
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
            <span>36%</span>
            <span>52%</span>
            <span>14%</span>
            <span>24%</span>
            <span>6%</span>
          </div>
          <TaGraph />
          {/* <ApGraph /> */}
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
            <span>36%</span>
            <span>52%</span>
            <span>14%</span>
            <span>24%</span>
            <span>6%</span>
          </div>
          <TaGraph />
          {/* <PcGraph /> */}
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
          <ContractGraph />
        </div>
        <div className="updateMessage">
          2023년 11월 10일에 마지막으로 업데이트 되었습니다.{" "}
        </div>
      </div>
      {/* DateChangeModal component */}
      {showModal && (
        <DateChangeModal
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
