import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Navbar from "../pages/Navbar";

import CustomerDetail from "../components/CustomerDetail";
import CustomerInfo from "../components/CustomerInfo"; // Assuming you have this component
import CustomerHistory from "../components/CustomerHistory"; // Assuming you have this component
import HistoryModal from "../components/HistoryModal";
import { useLocation } from "react-router-dom";

const Detail = () => {
  const location = useLocation();
  const { customerPk } = location.state;
  const [customerDetail, setCustomerDetail] = useState({});
  const [customerHistories, setCustomerHistories] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleCloseHistoryModal = () => setShowHistoryModal(false);
  const handleShowHistoryModal = () => setShowHistoryModal(true);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const urlDetail = `http://3.38.101.62:8080/v1/customer/${customerPk}`;
        const urlHistory = `http://3.38.101.62:8080/v1/schedule/${customerPk}`;

        // 고객 세부 정보 요청
        const responseDetail = await axios.get(urlDetail, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (responseDetail.data) {
          setCustomerDetail(responseDetail.data);
        }
        // 고객의 일정 정보 요청
        const responseHistory = await axios.get(urlHistory, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (responseHistory.data) {
          setCustomerHistories(responseHistory.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchCustomerDetail();
  }, [customerPk]);

  return (
    <div
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
        style={{
          marginLeft: "302px",
          height: "110vh",
        }}
      >
        <>
          <CustomerDetail customerPk={customerPk} />
          <hr />
          <div style={{ display: "flex" }}>
            <CustomerInfo customerPk={customerPk} />
          </div>
          <hr />
          <CustomerHistory customerPk={customerPk} />
        </>
      </div>
    </div>
  );
};

export default Detail;
