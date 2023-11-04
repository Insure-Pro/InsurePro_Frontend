import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../pages/Navbar";
import Dbbar from "../components/Dbbar";
import CustomerDetail from "../components/CustomerDetail";
import CustomerInfo from "../components/CustomerInfo"; // Assuming you have this component
import CustomerHistory from "../components/CustomerHistory"; // Assuming you have this component
import EditModalD from "../components/EditModalD";
import HistoryModal from "../components/HistoryModal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Analysis = () => {
  return (
    <div
      className="Detail_container"
      style={{
        display: "flex",
        backgroundColor: "#F5FAFF",
        width: "1400px",
        margin: "0 auto",
        borderRight: "2px solid #dde1e6",
      }}
    >
      <Navbar />
      <div
        className="analysis_container"
        style={{
          marginLeft: "52px",
          height: "100vh",
          userSelect: "none",
        }}
      >
        <div className="analysis_header maintitle">2023년 11월</div>
        <div className="analysis_subtitle">
          <span>TA 확률 : 00</span>
          <span>AP 확률: 00</span>
          <span>PC 확률: 00</span>
          <span> 청약 개수: 00</span>
        </div>
        <div className="analysis_explain">
          <div className="analysis_explain_item">
            <span>청약 갯수</span>{" "}
            <span>: 청약 갯수/ 이번달 분배받은 db고객 수 기준</span>
          </div>
          <div className="analysis_explain_item">
            <span>TA 확률</span>{" "}
            <span>: TA 갯수/ 이번달 분배받은 db고객 수 기준</span>
          </div>
          <div className="analysis_explain_item">
            <span>AP 확률</span>{" "}
            <span>: AP 갯수/ 이번달 분배받은 db고객 수 기준</span>
          </div>
          <div className="analysis_explain_item">
            <span>PC 확률</span>{" "}
            <span>: PC 갯수/ 이번달 분배받은 db고객 수 기준</span>
          </div>
        </div>
        <div className="analysis_graph1">graph1</div>
        <div className="analysis_graph2">graph2</div>
        <div className="analysis_graph3">graph3</div>
        <div className="analysis_graph4">graph4</div>
      </div>
    </div>
  );
};

export default Analysis;
